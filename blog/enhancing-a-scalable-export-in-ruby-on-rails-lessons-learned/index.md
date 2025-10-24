---
title: Enhancing a Scalable Export in Ruby on Rails: Lessons Learned
date: "2024-10-18T10:00:13.061Z"
description: "In my last blog post, I walked you through the implementation of a scalable export system in a Ruby on Rails application. Since then, I’ve encountered a few challenges, particularly around concurrency, file locking, and ensuring that data exports are..."
tags:
---

In my [last blog post](https://alvincrespo.hashnode.dev/build-a-scalable-export-in-ruby-on-rails), I walked you through the implementation of a scalable export system in a Ruby on Rails application. Since then, I’ve encountered a few challenges, particularly around concurrency, file locking, and ensuring that data exports are reliably processed when **multiple jobs need to write to the same ZIP file**. In this post, I'll dive deeper into those challenges and share the solutions I found to make the export system even more robust.

## **The Challenge: Concurrent Jobs and ZIP Files**

When you're building a feature to export user data, especially in large applications, handling concurrency is key. Each user might have various types of data to export, such as notes, files, or other content, and all of this needs to be bundled into a single ZIP file.

In my case, multiple background jobs (`ExportUserUploadedContentJob` and `ExportUserNotesJob`) were responsible for fetching the data and adding it to the same ZIP file. Initially, everything seemed straightforward—each job would write its content to the ZIP file, and a cleanup job would handle the rest. However, this caused problems when jobs tried to access the ZIP file simultaneously, leading to incomplete data in the final file. After debugging, I realized the following issues:

* **Race conditions**: Multiple jobs trying to write to the same ZIP file concurrently.
    
* **Incomplete writes**: Some jobs didn’t finish writing before another job tried to access the file, resulting in missing content.
    
* **File not properly closed**: The ZIP file wasn’t always flushed and saved to disk after every write.
    

To address these issues, I implemented a series of improvements, starting with how we manage exports in the database.

---

## **Managing Exports: Migration and Model**

Making an `Export` model would help me to monitor the status of several export jobs, control task completion, and track statistics like file size and time elapsed, allowing me to track the process of every export.

### **Migration for the** `exports` Table

```ruby
class CreateExports < ActiveRecord::Migration[7.0]
  def change
    create_table :exports do |t|
      t.references :user, null: false, foreign_key: true
      t.string :prefix, null: false
      t.integer :jobs_completed, default: 0
      t.integer :total_jobs, default: 2  # Adjust for the number of jobs you plan to run
      t.datetime :started_at
      t.datetime :completed_at
      t.integer :file_size, default: 0
      t.timestamps
    end
  end
end
```

### **Export Model**

The `Export` model tracks the start and completion of jobs, how many jobs have completed, and other metrics like the size of the final ZIP file. This allows us to track the state of an export, making it easy to determine when all jobs are finished and trigger the final cleanup and upload process.

Here’s the key structure for managing export state:

```ruby
class Export < ApplicationRecord
  belongs_to :user

  # Mark the start of the export
  def mark_started
    update!(started_at: Time.current)
  end

  # Mark the completion and calculate elapsed time
  def mark_completed(zip_file_path)
    update!(
      completed_at: Time.current,
      file_size: File.size(zip_file_path)  # Get file size in bytes
    )
  end

  # Increment job completion and check if all jobs are finished
  def mark_job_complete
    increment!(:jobs_completed)
    jobs_completed == total_jobs
  end

  # Calculate the total time taken for the export
  def time_elapsed
    return nil unless completed_at && started_at
    completed_at - started_at
  end
end
```

### **Changes to the** `ExportsJob`: Job Coordination

The `ExportsJob` is responsible for coordinating the different export jobs that will append data to the same ZIP file. Before launching the jobs, we make sure the ZIP file is created and ready for use.

```ruby
class ExportsJob < ApplicationJob
  queue_as :default

  def perform(user_id)
    prefix = SecureRandom.hex(8)
    zip_file_path = Rails.root.join("tmp", "#{prefix}_export.zip").to_s

    # Create an empty ZIP file before jobs start
    Zip::File.open(zip_file_path, Zip::File::CREATE) {}

    # Create a new export tracking record and mark the start
    export = Export.create!(user_id: user_id, prefix: prefix, total_jobs: 2)
    export.mark_started

    # Launch export jobs concurrently
    ExportUserUploadedContentJob.perform_later(user_id, zip_file_path, export.id)
    ExportUserNotesJob.perform_later(user_id, zip_file_path, export.id)
  end
end
```

* **Create the ZIP file**: Ensures that an empty ZIP file is created before any background job tries to write to it. This prevents errors where the file doesn’t exist when jobs attempt to append data.
    
* **Job coordination**: Each job is launched concurrently, but they will use file locks to ensure they don’t interfere with each other.
    

---

## **File Locking and Proper Commit Handling**

### **File Locking for Safe Concurrent Access**

To solve these issues, I implemented a file locking mechanism using Ruby’s [`flock`](https://ruby-doc.org/3.3.4/File.html#method-i-flock) method. This ensures that only one job can write to the ZIP file at a time. If another job tries to access the file while it's locked, it waits or retries until the lock is released.

Here’s how the file locking looks in practice:

```ruby
File.open(zip_file_path, 'r+') do |file|
  if file.flock(File::LOCK_EX | File::LOCK_NB)
    # Perform ZIP operations...
    file.flock(File::LOCK_UN)  # Release the lock
  else
    # Retry if lock is unavailable
    retry_job(wait: 5.seconds)
  end
end
```

This guarantees exclusive access to the file during write operations and prevents race conditions.

### **Ensuring Proper Commits with** `Zip::File#commit`

Even with the locking mechanism in place, I noticed that some data was still missing from the final ZIP file. The reason? The ZIP file wasn’t always being flushed to disk after each write. To resolve this, I added the [`zipfile.commit`](https://www.rubydoc.info/github/rubyzip/rubyzip/Zip/File#commit-instance_method) method at the end of each job to ensure all changes were saved:

```ruby
Zip::File.open(zip_file_path, Zip::File::CREATE) do |zipfile|
  # Write content to the ZIP file...
  zipfile.commit  # Ensure the file is flushed and saved
end
```

This simple change ensures that each job commits its work before releasing the lock, preventing data loss.

Here is a full example of file locking and commiting would look like in a job:

```ruby
require "zip"
require "csv"

class ExportUserNotesJob < ApplicationJob
  queue_as :default

  def perform(user_id, zip_file_path, export_id)
    user = User.find(user_id)

    File.open(zip_file_path, "r+") do |file|
      Rails.logger.info "#{self.class.name} writing to #{zip_file_path}"
      if file.flock(File::LOCK_EX | File::LOCK_NB)
        Rails.logger.info "Lock acquired by #{self.class.name} for #{zip_file_path}"

        csv_content = CSV.generate(headers: true) do |csv|
          csv << [ "Title", "Body" ]
          user.notes.find_each do |note|
            csv << [ note.title, note.body.to_plain_text ]
          end
        end

        file.get_output_stream("user_notes.csv") do |f|
          f.write(csv_content)
        end

        file.commit

        file.flock(File::LOCK_UN)  # Unlock the file
        Rails.logger.info "Lock released by #{self.class.name} for #{zip_file_path}"
      else
        Rails.logger.info "Failed to acquire lock for #{self.class.name}, retrying..."
        retry_job(wait: 5.seconds)
        return
      end
    end

    # Update export progress
    export = Export.find(export_id)
    if export.mark_job_complete
      ExportCleanupJob.perform_later(user_id, zip_file_path, export.prefix)
    end
  end
end
```

In the above job, we are getting all notes for a user and creating a CSV for their requested export. We start by opening the zip file, locking it with the a bitwise OR of `File::LOCK_EX | File::LOCK_NB`. Once the zip is locked we proceed with generating the CSV content, outputting it to the zip file and ultimately ensuring the content of the zip is committed. Once thats done, we unlock the zip and move on with the job. If the lock fails to be acquired we log out the failure and retry the job after 5 seconds.

---

## **Key Takeaways**

* **File locking** with `flock` is essential when multiple background jobs need to write to the same file concurrently.
    
* Always **commit** changes when modifying a ZIP file in a concurrent environment to ensure data is saved properly.
    
* Adding retry logic helps manage cases where a job cannot immediately acquire the lock, allowing the system to recover gracefully.
    

These small but powerful adjustments have made my export process more reliable and scalable.

---

## Alternative Approaches

When expanding on the coordination of multiple export jobs using a ZIP file, it's important to weigh the **tradeoffs** and consider **alternative approaches** depending on your application’s needs, scalability, and complexity. Here are some tradeoffs and alternatives worth exploring.

### File Locking

My current approach locks the ZIP file before writing and releases the lock after it’s done. While this prevents race conditions, file locking comes with its own tradeoffs:

* **Pro**: Simple and easy to implement. It provides an effective way to prevent concurrency issues when multiple jobs write to the same file.
    
* **Con**: Lock contention can arise when many jobs are trying to access the same file at once. If several jobs are queued to write to the ZIP file, they must wait for the file lock to be released, which can slow down the process.
    

**Alternatives**

* **Database-Backed Job Queue Coordination**: Instead of relying on file locks, you can store the results of each job in the database, then have a single process handle creating the ZIP file. This avoids locking issues but adds the overhead of managing results in the database.
    
* **Distributed Locking Services**: For large-scale systems, using a distributed locking service such as Redis-based locking (e.g., with `Redlock`) allows for more robust concurrency control. This helps ensure locks are respected across distributed systems, which is useful when dealing with multiple servers or processes.
    

### Sequential Job Execution

Although jobs are triggered concurrently, the need for file locking causes them to effectively run sequentially when writing to the ZIP file, as each job must wait for the previous one to finish.

* **Pro**: Simple and predictable. Jobs run in sequence and only one writes to the ZIP at a time.
    
* **Con**: This limits the speed at which jobs can complete since they cannot write in parallel.
    

**Alternatives**

* **Write Each Job’s Output to Separate Files**: Instead of having each job write directly to the ZIP, have each job write its output to a temporary file. Once all jobs are complete, you can use a final job to combine all the temporary files into a single ZIP file. This allows each job to run concurrently and avoids file contention.
    
* **Stream the Output**: For very large exports, instead of writing the entire ZIP to disk in one go, you can stream the output directly to the user or to cloud storage (such as S3). This avoids large intermediate files and can reduce the overall time to delivery.
    

### Resource Usage

* **Pro**: Using a single ZIP file reduces memory overhead compared to storing each piece of data in memory before finalizing the export.
    
* **Con**: Writing large files to disk can consume significant disk space and I/O resources, especially when many exports are happening simultaneously.
    

**Alternatives**

* **In-Memory Zip Creation**: If the exports are relatively small, you can create the ZIP file in memory using `StringIO` or a similar mechanism. This reduces disk I/O but increases memory usage.
    
* **Direct Streaming to Cloud Storage**: Instead of writing the ZIP file to local disk, you could stream each part of the ZIP directly to cloud storage (e.g., AWS S3) as the jobs are processed. This reduces the need for local disk space but may require more complex coordination.
    

### Failure Handling

With multiple concurrent jobs writing to a single file, ensuring failure handling and retries are robust is important. If one job fails to complete, the entire export could be incomplete or corrupted.

* **Pro**: Jobs can retry upon failure, ensuring eventual completion.
    
* **Con**: If retries are not handled carefully (e.g., ensuring the state of the ZIP file isn’t corrupted), multiple failures can still result in partial exports.
    

**Alternatives**

* **Atomic File Writes**: Using temporary files for each job and only moving them into the final ZIP once completed ensures that partial failures do not corrupt the final file. This way, even if a job fails, you can retry it without affecting the rest of the export.
    
* **Job State Tracking**: Implement tracking of each job’s state in the database. If a job fails, it can be retried without corrupting the overall export, and the ZIP creation can be resumed once the failed job completes successfully.
    

Depending on the scenario, such as large data sets or high concurrency requirements, a mixture of these approaches will be needed. Keeping it simple is the first step. Once you learn more about the behavior of your system, thats when taking a closer look at these alternatives might be the right choice for you.

---

## **Final Thoughts**

Enabling users to have full control of data starts with creating an exporting system that is easy, fast and scalable. Kicking off concurrent jobs that lookup, generate and manage files can be complex. In my personal project I circumvented race conditions and ensured that each job accurately writes to a ZIP file with file locking and proper file committing. Tracking exports significantly made it easier to debug and manage the system. Implementing these practices in your Ruby on Rails applications can save significant complications in the future.  
  
Let me know if you have similar problems and what techniques you have applied to go beyond them! Drop a comment or reach out to me on my [website](https://alvincrespo.com/), I’m always up for a friendly chat.

---

## References

[File#flock](https://ruby-doc.org/3.3.4/File.html#method-i-flock)

[Zip::File#commit](https://www.rubydoc.info/github/rubyzip/rubyzip/Zip/File#commit-instance_method)