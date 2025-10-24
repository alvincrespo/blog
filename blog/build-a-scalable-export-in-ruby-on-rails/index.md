---
title: Build a Scalable Export in Ruby on Rails
date: "2024-10-16T10:07:36.383Z"
description: "Hey there! If you're a software developer with a few years of expertise or an entrepreneur establishing a platform and realize your customers require a way to export their data, this post is for you. I've been creating SaaS applications for 15 years ..."
tags:
---

Hey there! If you're a software developer with a few years of expertise or an entrepreneur establishing a platform and realize your customers require a way to export their data, this post is for you. I've been creating SaaS applications for 15 years and have done a decent amount of export work. I recently created a feature in a Ruby on Rails that enabled customers to export their uploaded content from AWS S3 and thought I'd share some of it with you.

By the end of this post, you'll understand how to not only develop a similar solution, but also make it efficient and scalable. Ready? Let's dive in!

## Why Build an Export Job?

So, why do you need an export job in the first place? Well, if you’re dealing with user-uploaded content—there’s a good chance your users will want to download their data at some point. It could be for regulatory reasons, reporting, backups, or simply peace of mind. That’s where an export job comes in.

Now, let’s break down the key steps.

## Setting Up the ExportJob Class

Here’s the core of the solution—an `ExportsJob` class that we can use to gather all the files a user has uploaded and zip them up for easy download. Below is the code, and I’ll explain each part in a friendly, step-by-step way:

```ruby
require "zip"
require "open-uri"

class ExportsJob < ApplicationJob
  queue_as :default

  def perform(user_id)
    user = User.find(user_id)
    s3_client = Aws::S3::Client.new
    s3_resource = Aws::S3::Resource.new(client: s3_client)
    bucket_name = ENV.fetch("AWS_S3_BUCKET", "your-s3-bucket-name")
    bucket = s3_resource.bucket(bucket_name)
    prefix = SecureRandom.hex(8)

    zip_file_path = Rails.root.join("tmp", "#{prefix}_export.zip")

    Zip::File.open(zip_file_path, Zip::File::CREATE) do |zipfile|
      bucket.objects(prefix: user.uuid).each do |object|
        file_name = ActiveStorage::Blob.find_by(key: object.key).filename
        zipfile.get_output_stream(file_name) do |f|
          object.get do |chunk|
            f.write(chunk)
          end
        end
      end
    end

    export_key = "exports/#{prefix}_export.zip"
    File.open(zip_file_path, "rb") do |file|
      s3_client.put_object(bucket: bucket_name, key: export_key, body: file)
    end

    File.delete(zip_file_path)

    UserMailer.export_ready(user, export_key).deliver_now
  end
end
```

### Setting Up Your AWS S3 Integration

First things first, we need to pull in the right tools to interact with your file storage. In this case, I’m using AWS S3 for file storage, so make sure you’ve got the AWS SDK set up and configured in your app.

You’ll want to start by creating an initializer to configure the AWS library:

```ruby
# config/initializers/aws.rb

require "aws-sdk-s3"

Aws.config.update(
  region: ENV.fetch("AWS_REGION", "us-east-1"),
  credentials: Aws::Credentials.new(
    ENV.fetch("AWS_ACCESS_KEY_ID"),
    ENV.fetch("AWS_SECRET_ACCESS_KEY")
  )
)
```

Going back to our job, let’s create an S3 client, S3 resource and retrieve an instance of the bucket, or [`Aws::S3::Bucket`](https://docs.aws.amazon.com/sdk-for-ruby/v3/api/Aws/S3/Bucket.html).

```ruby
s3_client = Aws::S3::Client.new
s3_resource = Aws::S3::Resource.new(client: s3_client)
bucket_name = ENV.fetch("AWS_S3_BUCKET", "your-s3-bucket-name")
bucket = s3_resource.bucket(bucket_name)
```

Make sure you replace `"your-s3-bucket-name"` with the correct bucket name. If you haven’t set up your bucket yet, head over to the AWS Console and do that first. You’ll need the bucket name handy for this job. Setting up and configuring an S3 bucket is beyond the scope of this post, but I’ll write another one up soon.

### Gathering the Files

Next, I wanted to gather all of the files uploaded by a user. Each file is stored in S3 with a unique `key` tied to the user's `uuid`. Side note, the `uuid` being used here is a an identifier for the referring object on S3, not the unique identifier of the users record in the application. In this step, we loop through those files and add them to a zip archive:

```ruby
bucket.objects(prefix: user.uuid).each do |object|
  file_name = ActiveStorage::Blob.find_by(key: object.key).filename
  zipfile.get_output_stream(file_name) do |f|
    object.get do |chunk|
      f.write(chunk)
    end
  end
end
```

There are a couple of items to note here.

1. `bucket.objects(prefix: user.uuid)` returns an instance of `Aws::S3::ObjectSummary::Collection`
    
2. It might be worth exploring the inherited `limit` method from `Aws::Resources::Collection` to paginate over results.
    
3. Another optimization that can be made here is to eager load `ActiveStorage::Blob` instances, although that has it’s own tradeoffs here.
    

### Compressing the Files into a Zip

We’re utilizing [`rubyzip`](https://github.com/rubyzip/rubyzip) to create a `zip` file, so you’ll want to add the dependency to your Gemfile:

```ruby
# Gemfile

gem "rubyzip"
```

The `rubyzip` library makes it super easy to compress files. When working with large datasets, memory management is key, so we use [`get_output_stream`](https://www.rubydoc.info/github/rubyzip/rubyzip/Zip%2FFile:get_output_stream) to write data to the zip file in chunks rather than loading it all into memory at once. This way, even if a user has a ton of files, the process won’t choke on large data volumes.

```ruby
Zip::File.open(zip_file_path, Zip::File::CREATE) do |zipfile|
  # Add files to the zip here...
end
```

### Uploading the Zip File to S3

Once we’ve zipped up all the user’s files, we need to store that zip file somewhere. In this case, I upload the zip file back to S3 under an `exports/` folder:

```ruby
export_key = "exports/#{prefix}_export.zip"
File.open(zip_file_path, "rb") do |file|
  s3_client.put_object(bucket: bucket_name, key: export_key, body: file)
end
```

I generate a random `prefix` so each export has a unique name. After uploading the file, it’s easy for the user to download it.

### Cleanup and Notify the User

After uploading the zip, it’s good housekeeping to delete the local temporary file. Also, it’s crucial to notify the user when their export is ready. Here, I send an email notification, but you could also send an in-app notification or SMS, depending on what works best for your app:

```ruby
File.delete(zip_file_path)
UserMailer.export_ready(user, export_key).deliver_now
```

And that's it! The user gets notified, and they can download their data whenever they want.

## Pro Tips for Scaling Your Export Job

If your app grows or you start getting users with massive amounts of data, here are a few things to keep in mind:

1. **Batch Your Exports**: For really large exports, you might want to break it up into smaller batches to avoid timeouts or memory issues. Depending on the volume of data being exported, you might need a pipeline or job that creates + manages sub-jobs / exports.
    
2. **Use Background Jobs**: This job runs asynchronously using `ActiveJob` + `Sidekiq`, which is perfect for long-running tasks.
    
3. **Monitor Performance**: Keep an eye on performance. Make sure the export job doesn’t eat up too many resources and slow down your app.
    

## Wrapping It Up

So, that’s how I built an export job in Ruby on Rails to ensure users could easily download all their uploaded content. If you’re an engineer looking to implement something similar or an entrepreneur who needs a solution like this for your app, I hope you found this post helpful! Feel free to reach out if you have any questions, or connect with me on my blog for more technical insights.

## References

[AWS::S3::Bucket](https://docs.aws.amazon.com/sdk-for-ruby/v3/api/Aws/S3/Bucket.html)

[rubyzip](https://github.com/rubyzip/rubyzip)