---
title: Tips for Working with Complex Normalized Databases
date: "2024-07-30T12:18:53.819Z"
description: "We’ve all been taught the benefits of normalizing our data. So I won’t bore you with those details, but to sum it up:  Normalization is the process of organizing data in a database. It includes creating tables and establishing relationships between t..."
tags:
---

We’ve all been taught the benefits of normalizing our data. So I won’t bore you with those details, but to sum it up:

> Normalization is the process of organizing data in a database. It includes creating tables and establishing relationships between those tables according to rules designed both to protect the data and to make the database more flexible by eliminating redundancy and inconsistent dependency.
> 
> Microsoft 365 - [Description of normalization](https://learn.microsoft.com/en-us/office/troubleshoot/access/database-normalization-description)

To be honest, normalization never really crossed my mind until recently when I’ve had to deal with multiple legacy applications that were “highly normalized”. And when I say “highly normalized” I mean “HIGHLY NORMALIZED” - to the point where it just doesn’t make sense anymore. Which reminded me of this amazing article by Coding Horror: [Maybe Normalizing Isn’t Normal](https://blog.codinghorror.com/maybe-normalizing-isnt-normal/).

The problem is that, unless you’re really *lucky*, you won’t need to worry about things like this. Instead of talking about this hypothetically, let's walk through a specific scenario and try different techniques out to understand the complexities of this topic. Once we've gone over this scenario lets talk through the technicalities to better understand why highly normalized architectures could be problematic and review optimizations we can consider to improve our experience.

## The Scenario

<div data-node-type="callout">
<div data-node-type="callout-emoji">💡</div>
<div data-node-type="callout-text">You can check out the code for this article <a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/alvincrespo/normalized-architectures-perf" style="pointer-events: none">here</a>.</div>
</div>

You’re working on an established legacy, large-scale SASS (software as a service) based inventory management system. The system consists of inventory items, and each inventory item has a category, supplier, warehouse and various attributes. A client has requested a report and this report needs to display the item's details including it's supplier name and warehouse name.

Here’s a simplified schema, without the multi-tenancy (just to keep things simple):

Each item references entries in the `categories`, `suppliers`, and `warehouses` tables. Attributes for each item are stored in the `item_attributes` table. This all make sense and is pretty easy to whip up:

```sql
CREATE TABLE items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category_id INT,
    supplier_id INT,
    warehouse_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id)
);

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE warehouses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE item_attributes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT,
    attribute_name VARCHAR(255) NOT NULL,
    attribute_value VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES items(id)
);

-- To illustrate the denormalization strategy mentioned, here’s an example of a denormalized items_denormalized table:

CREATE TABLE items_denormalized (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category_name VARCHAR(255),
    supplier_name VARCHAR(255),
    warehouse_name VARCHAR(255),
    attribute_name VARCHAR(255),
    attribute_value VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_items_id ON items(id);
CREATE INDEX idx_categories_id ON categories(id);
CREATE INDEX idx_suppliers_id ON suppliers(id);
CREATE INDEX idx_warehouses_id ON warehouses(id);
CREATE INDEX idx_item_attributes_item_id ON item_attributes(item_id);
```

## Seeding Data

For any performance work we do, it’s important to be able to reproduce the scale we’re anticipating in order to get a good idea of how our application will perform. That’s why I’ve put together the following seeding script:

```ruby
require 'faker'

def create_records(message, &block)
  puts "Creating #{message}."
  starting = Process.clock_gettime(Process::CLOCK_MONOTONIC)
  yield if block_given?
  ending = Process.clock_gettime(Process::CLOCK_MONOTONIC)
  elapsed = ending - starting
  puts "#{message.capitalize} created. #{elapsed}"
end

puts 'Truncating database...'
ActiveRecord::Tasks::DatabaseTasks.truncate_all
puts 'Database truncated.'

create_records('categories') do
  10.times do
    Category.create(name: Faker::Book.genre)
  end
end

create_records('suppliers') do
  25.times do
    Supplier.create(name: Faker::Company.name)
  end
end

create_records('warehouses') do
  1000.times do
    Warehouse.create(name: Faker::Company.name, location: Faker::Address.full_address)
  end
end

create_records('items') do
  categories = Category.all.to_a
  suppliers = Supplier.all.to_a
  warehouses = Warehouse.all.to_a

  items = 100_000.times.map do
    {
      name: Faker::Commerce.product_name,
      category_id: categories.sample.id,
      supplier_id: suppliers.sample.id,
      warehouse_id: warehouses.sample.id
    }
  end

  items.each_slice(1000) do |batch|
    Item.insert_all(batch)
  end
end

create_records('item attributes') do
  items = Item.all

  # We'll bump this up later to 1_000_000 in order to see
  # the perf issues come up.
  item_attributes = 100_000.times.map do
    {
      attribute_name: Faker::Lorem.word,
      attribute_value: Faker::Lorem.word,
      item_id: items.sample.id
    }
  end

  item_attributes.each_slice(1000) do |batch|
    ItemAttribute.insert_all(batch)
  end
end

create_records('denormalized items') do
  items_with_associations = Item.includes(:category, :supplier, :warehouse)

  denormalized_items_attributes = []

  items_with_associations.find_each(batch_size: 1000) do |item|
    denormalized_items_attributes << {
      name: item.name,
      item_id: item.id,
      category_name: item.category.name,
      category_id: item.category.id,
      supplier_name: item.supplier.name,
      supplier_id: item.supplier.id,
      warehouse_name: item.warehouse.name,
      warehouse_id: item.warehouse.id,
      created_at: DateTime.now,
      updated_at: DateTime.now
    }
  end

  denormalized_items_attributes.each_slice(1000) do |batch|
    ItemDenormalized.insert_all(batch)
  end
end
```

This seeding script helps create records for all our entities. You can fine tune the script to create more or less records to stress test the architecture. Which is exactly what we're going to to do in a few moments.

Now, remember, this will be running on your local computer so we’re not testing production level resources here. Hopefully, you can have a production level environment to experiment with different strategies, but the point here isn't to replicate production - but get a good understanding of the complexities of working with highly normalized architectures.

When we run the seeds, we’ll get the following logs:

```sh
bundle exec rails db:seed
Truncating database...
Database truncated.
Creating categories.
Categories created. 3.226257999893278
Creating suppliers.
Suppliers created. 0.1299410001374781
Creating warehouses.
Warehouses created. 4.184017000021413
Creating items.
Items created. 7.629256000043824
Creating item attributes.
Item attributes created. 59.715396999847144
Creating denormalized items.
Denormalized items created. 12.066422999836504
```

Alright, let’s start running some queries.

## Performance? What performance?!

So, let’s say I want all items except those from McDermott-Casper, a supplier who has gone bankrupt. Also, I don’t want items that have the attributes enim and/or modi associated to them:

We can write a query, with ActiveRecord, pretty easily like this:

```ruby
excluded_suppliers =
  Supplier
    .select('id')
    .where(name: "McDermott-Casper")
    .to_sql

excluded_attributes =
  ItemAttribute
    .select(:item_id)
    .where(attribute_name: ['enim', 'modi'])
    .to_sql

Item
  .distinct
  .select('items.id, items.name, categories.name AS category_name, suppliers.name AS supplier_name, warehouses.name AS warehouse_name')
  .joins(:category, :supplier, :warehouse)
  .left_outer_joins(:item_attributes)
  .where("items.supplier_id NOT IN (#{excluded_suppliers})")
  .where("items.id NOT IN(#{excluded_attributes})")
  .to_a
```

The conditions to exclude items based on our scenario are utilized in the `WHERE` conditionals as embedded subqueries, while we join category, supplier, warehouse and (left outer join) item attributes to ensure that we retrieve only the matching items of our condition.

Alright, let’s test this out:

```ruby
bundle exec rails c
Loading development environment (Rails 7.1.3.4)
irb(main):001* excluded_suppliers =
irb(main):002>   Supplier
irb(main):003>     .select('id')
irb(main):004>     .where(name: "McDermott-Casper")
irb(main):005>     .to_sql
=> "SELECT \"suppliers\".\"id\" FROM \"suppliers\" WHERE \"suppliers\".\"name\" = 'McDermott-Casper'"
irb(main):006* excluded_attributes =
irb(main):007>   ItemAttribute
irb(main):008>     .select(:item_id)
irb(main):009>     .where(attribute_name: ['enim', 'modi'])
irb(main):010>     .to_sql
=> "SELECT \"item_attributes\".\"item_id\" FROM \"item_attributes\" WHERE \"item_attributes\".\"attribute_name\" IN ('enim', 'modi')"
irb(main):011> Item
irb(main):012>   .distinct
irb(main):013>   .select('items.id, items.name, categories.name AS category_name, suppliers.name AS supplier_name, warehouses.name AS warehouse_name')
irb(main):014>   .joins(:category, :supplier, :warehouse)
irb(main):015>   .left_outer_joins(:item_attributes)
irb(main):016>   .where("items.supplier_id NOT IN (#{excluded_suppliers})")
irb(main):017>   .where("items.id NOT IN(#{excluded_attributes})")
irb(main):018>   .to_a
  Item Load (535.5ms)  SELECT DISTINCT items.id, items.name, categories.name AS category_name, suppliers.name AS supplier_name, warehouses.name AS warehouse_name FROM "items" INNER JOIN "categories" ON "categories"."id" = "items"."category_id" INNER JOIN "suppliers" ON "suppliers"."id" = "items"."supplier_id" INNER JOIN "warehouses" ON "warehouses"."id" = "items"."warehouse_id" LEFT OUTER JOIN "item_attributes" ON "item_attributes"."item_id" = "items"."id" WHERE (items.supplier_id NOT IN (SELECT "suppliers"."id" FROM "suppliers" WHERE "suppliers"."name" = 'McDermott-Casper')) AND (items.id NOT IN(SELECT "item_attributes"."item_id" FROM "item_attributes" WHERE "item_attributes"."attribute_name" IN ('enim', 'modi')))
=>
```

Awesome! We’re at sub-second fetches.

Alright. Let’s see what happens when we bump up the number of attributes in the system to…lets say a million. We can do this by running the following code, extracted from the seed script:

```ruby
  items = Item.all

  # We'll bump this up later to 1_000_000 in order to see
  # the perf issues come up.
  item_attributes = 900_000.times.map do
    {
      attribute_name: Faker::Lorem.word,
      attribute_value: Faker::Lorem.word,
      item_id: items.sample.id
    }
  end

  item_attributes.each_slice(1000) do |batch|
    ItemAttribute.insert_all(batch)
  end
```

Now keep in mind that the above had 1,187 item attribute records that matched enim or modi.

```ruby
irb(main):001* excluded_suppliers =
irb(main):002>   Supplier
irb(main):003>     .select('id')
irb(main):004>     .where(name: "McDermott-Casper")
irb(main):005>     .to_sql
irb(main):006> 
=> "SELECT \"suppliers\".\"id\" FROM \"suppliers\" WHERE \"suppliers\".\"name\" = 'McDermott-Casper'"
irb(main):007* excluded_attributes =
irb(main):008>   ItemAttribute
irb(main):009>     .select(:item_id)
irb(main):010>     .where(attribute_name: ['enim', 'modi'])
irb(main):011>     .to_sql
irb(main):012> 
=> "SELECT \"item_attributes\".\"item_id\" FROM \"item_attributes\" WHERE \"item_attributes\".\"attribute_name\" IN ('enim', 'modi')"
irb(main):013> Item
irb(main):014>   .distinct
irb(main):015>   .select('items.id, items.name, categories.name AS category_name, suppliers.name AS supplier_name, warehouses.name AS warehouse_name')
irb(main):016>   .joins(:category, :supplier, :warehouse)
irb(main):017>   .left_outer_joins(:item_attributes)
irb(main):018>   .where("items.supplier_id NOT IN (#{excluded_suppliers})")
irb(main):019>   .where("items.id NOT IN(#{excluded_attributes})")
irb(main):020>   .to_a
irb(main):021> 
  Item Load (3002.4ms)  SELECT DISTINCT items.id,
```

Whoa! Ok. Now we’re at 3s.

The problem will only get worse as more items are added to the system over time and in relation item\_attributes will continue to impact this specific query. When 900,000 more attributes were added there was an increase of the number of records that matched `enim` or `modi`. In fact we went from 1,187 to 12,154 records.

This kind of scale is completely normal and really shouldn’t be unexpected. As the number of attributes for items can increase significantly over time in an inventory management system for all sorts of reasons. Ok, so more records were added - of course performance would be impacted. What exactly is happening?

## Is normalization really the issue here?

I’m going to remove the joins to categories and warehouses:

```ruby
irb(main):029> Item
irb(main):030>   .distinct
irb(main):031>   .select('items.id, items.name, suppliers.name AS supplier_name')
irb(main):032>   .joins(:supplier)
irb(main):033>   .left_outer_joins(:item_attributes)
irb(main):034>   .where("items.supplier_id NOT IN (#{excluded_suppliers})")
irb(main):035>   .where("items.id NOT IN(#{excluded_attributes})")
irb(main):036>   .to_a
irb(main):037>
  Item Load (1938.4ms)  SELECT DISTINCT items.id, items.name, suppliers.name AS supplier_name FROM "items" INNER JOIN "suppliers" ON "suppliers"."id" = "items"."supplier_id" LEFT OUTER JOIN "item_attributes" ON "item_attributes"."item_id" = "items"."id" WHERE (items.supplier_id NOT IN (SELECT "suppliers"."id" FROM "suppliers" WHERE "suppliers"."name" = 'McDermott-Casper')) AND (items.id NOT IN(SELECT "item_attributes"."item_id" FROM "item_attributes" WHERE "item_attributes"."attribute_name" IN ('enim', 'modi')))
=>
```

Ok, so yeah, we get a ~30% improvement just removing the join. Let's run an explain on these and try to understand what's going on.

```sql
Unique  (cost=80266.89..84016.89 rows=250000 width=99)
  ->  Sort  (cost=80266.89..80891.89 rows=250000 width=99)
        Sort Key: items.id, items.name, categories.name, suppliers.name, warehouses.name
        ->  Hash Join  (cost=20105.00..44177.93 rows=250000 width=99)
              Hash Cond: (items.warehouse_id = warehouses.id)
              ->  Hash Join  (cost=20066.50..43480.40 rows=250000 width=89)
                    Hash Cond: (items.supplier_id = suppliers.id)
                    ->  Hash Join  (cost=20030.63..42785.86 rows=250000 width=78)
                          Hash Cond: (items.category_id = categories.id)
                          ->  Hash Right Join  (cost=19998.80..42094.91 rows=250000 width=54)
                                Hash Cond: (item_attributes.item_id = items.id)
                                ->  Seq Scan on item_attributes  (cost=0.00..19471.00 rows=1000000 width=8)
                                ->  Hash  (cost=19686.30..19686.30 rows=25000 width=54)
                                      ->  Seq Scan on items  (cost=16933.30..19686.30 rows=25000 width=54)
                                            Filter: ((NOT (hashed SubPlan 1)) AND (NOT (hashed SubPlan 2)))
                                            SubPlan 1
                                              ->  Seq Scan on suppliers suppliers_1  (cost=0.00..24.38 rows=1 width=8)
"                                                    Filter: ((name)::text = 'McDermott-Casper'::text)"
                                            SubPlan 2
                                              ->  Gather  (cost=1000.00..16878.93 rows=11996 width=8)
                                                    Workers Planned: 2
                                                    ->  Parallel Seq Scan on item_attributes item_attributes_1  (cost=0.00..14679.33 rows=4998 width=8)
"                                                          Filter: ((attribute_name)::text = ANY ('{enim,modi}'::text[]))"
                          ->  Hash  (cost=19.70..19.70 rows=970 width=40)
                                ->  Seq Scan on categories  (cost=0.00..19.70 rows=970 width=40)
                    ->  Hash  (cost=21.50..21.50 rows=1150 width=27)
                          ->  Seq Scan on suppliers  (cost=0.00..21.50 rows=1150 width=27)
              ->  Hash  (cost=26.00..26.00 rows=1000 width=26)
                    ->  Seq Scan on warehouses  (cost=0.00..26.00 rows=1000 width=26)
```

The plan above is telling us the output of each join is funneled into the next one:

(items &lt;&gt; warehouses) -&gt; (items &lt;&gt; suppliers) -&gt; (items &lt;&gt; categories)

Because of the multiple joins, we essentially increase the performance impact as more data is spread out across your database, e.g. normalization.

Now, let’s look at the plan after we remove the joins:

```sql
Unique  (cost=73750.91..76250.91 rows=250000 width=49)
  ->  Sort  (cost=73750.91..74375.91 rows=250000 width=49)
        Sort Key: items.id, items.name, suppliers.name
        ->  Hash Join  (cost=20034.68..42789.45 rows=250000 width=49)
              Hash Cond: (items.supplier_id = suppliers.id)
              ->  Hash Right Join  (cost=19998.80..42094.91 rows=250000 width=38)
                    Hash Cond: (item_attributes.item_id = items.id)
                    ->  Seq Scan on item_attributes  (cost=0.00..19471.00 rows=1000000 width=8)
                    ->  Hash  (cost=19686.30..19686.30 rows=25000 width=38)
                          ->  Seq Scan on items  (cost=16933.30..19686.30 rows=25000 width=38)
                                Filter: ((NOT (hashed SubPlan 1)) AND (NOT (hashed SubPlan 2)))
                                SubPlan 1
                                  ->  Seq Scan on suppliers suppliers_1  (cost=0.00..24.38 rows=1 width=8)
"                                        Filter: ((name)::text = 'McDermott-Casper'::text)"
                                SubPlan 2
                                  ->  Gather  (cost=1000.00..16878.93 rows=11996 width=8)
                                        Workers Planned: 2
                                        ->  Parallel Seq Scan on item_attributes item_attributes_1  (cost=0.00..14679.33 rows=4998 width=8)
"                                              Filter: ((attribute_name)::text = ANY ('{enim,modi}'::text[]))"
              ->  Hash  (cost=21.50..21.50 rows=1150 width=27)
                    ->  Seq Scan on suppliers  (cost=0.00..21.50 rows=1150 width=27)
```

Ok, so we get a better query plan. Less joins, less data to scan and therefore more performance. However, doing this won't meet the requirements. Remember, the report needs the names of the associated suppliers and warehouses. Let's see what happens when we denormalize the data and simplify the lookup process.

```ruby
irb(main):074* excluded_suppliers =
irb(main):075>   Supplier
irb(main):076>     .select('id')
irb(main):077>     .where(name: "McDermott-Casper")
irb(main):078>     .to_sql
irb(main):079> 
irb(main):080* excluded_attributes =
irb(main):081>   ItemAttribute
irb(main):082>     .select(:item_id)
irb(main):083>     .where(attribute_name: ['enim', 'modi'])
irb(main):084>     .to_sql
irb(main):085> 
irb(main):086> ItemDenormalized
irb(main):087>   .distinct
irb(main):088>   .select('items_denormalized.id as id, items_denormalized.category_name as category_name, items_denormalized.supplier_name as supplier_name, items_denormalized.warehouse_name as warehouse_name')
irb(main):089>   .joins(:supplier)
irb(main):090>   .left_outer_joins(:item_attributes)
irb(main):091>   .where("items_denormalized.supplier_id NOT IN (#{excluded_suppliers})")
irb(main):092>   .where("items_denormalized.item_id NOT IN(#{excluded_attributes})")
irb(main):093>   .to_a
irb(main):094> 
  ItemDenormalized Load (1107.3ms)  SELECT DISTINCT items_denormalized.id as id,
```

In this example, the lookup on the denormalized table performed similarly to when we removed the joins (1107.3ms v. 1938.4ms). The difference is that we have the category and warehouse names. Denormalization does introduce multiple complexities that need to be handled; such as redundancy and integrity of the data, e.g. what happens when categories are updated? or when warehouses are deleted?

Putting that aside though, we see that denormalization handles certain scenarios well when it comes to performance. We should consider it's benefits when building applications that will inevitably need to scale. In our example above, we can see with just a million records, we start to run into some performance bottlenecks.

## Performance Bottlenecks

Let's think through what bottlenecks start to come into play after running through the examples above.

### Complex Queries

Highly normalized schemas often require complex queries with multiple joins, which can be slow and resource-intensive.

```sql
SELECT DISTINCT
	items.id,
	items.name,
	categories.name AS category_name,
	suppliers.name AS supplier_name,
	warehouses.name AS warehouse_name
FROM
	"items"
	INNER JOIN "categories" ON "categories"."id" = "items"."category_id"
	INNER JOIN "suppliers" ON "suppliers"."id" = "items"."supplier_id"
	INNER JOIN "warehouses" ON "warehouses"."id" = "items"."warehouse_id"
	LEFT OUTER JOIN "item_attributes" ON "item_attributes"."item_id" = "items"."id"
WHERE (items.supplier_id NOT IN(
		SELECT
			"suppliers"."id" FROM "suppliers"
		WHERE
			"suppliers"."name" = 'McDermott-Casper'))
	AND(items.id NOT IN(
			SELECT
				"item_attributes"."item_id" FROM "item_attributes"
			WHERE
				"item_attributes"."attribute_name" IN('enim', 'modi')));
```

I wouldn't consider the above too complex, however, the conditions that execute subqueries can start to get complex when joining on joins. This happens a lot in large scale applications that have evolved over time. Again, normalization is great in an ideal world - but it is also important to understand what other complexities it introduces.

### **Increased I/O Operations**

Each table lookup can lead to additional I/O operations, slowing down the overall query performance. When we start to talk through IO operations in the database, it's important to know, high level, why this is an important part of the puzzle. So let's dive into some issues that come up at scale.

**Read/Write:** Each join that involves disk-based temporary tables or large data sets will increase the number of disk reads and writes. This can cause a significant I/O load, especially in applications where the behavior is quite active (jobs, high traffic, etc.).

**Buffer Pool Pressure:** Joins can put pressure on the MySQL buffer pool, especially with larger data sets. When the buffer pool is full, MySQL has to [evict pages](https://dev.mysql.com/doc/refman/8.4/en/memory-use.html#:~:text=A%20buffer%20pool%20that%20is%20too%20small%20may%20cause%20excessive%20churning%20as%20pages%20are%20flushed%20from%20the%20buffer%20pool%20only%20to%20be%20required%20again%20a%20short%20time%20later.) to make room for new data, causing additional disk I/O.

**Temporary Tables:**  MySQL may create temporary tables to hold intermediate results during complex join operations. [These temporary tables can be stored in memory or on disk, depending on their size](https://dev.mysql.com/blog-archive/how-to-force-temporary-tables-to-be-created-on-disk-directly/#:~:text=By%20default%2C%20MySQL%20creates%20in%2Dmemory%20temporary%20tables%20in%20the%20MEMORY%20engine.%20The%20maximum%20size%20for%20in%2Dmemory%20temporary%20tables%20is%20the%20minimum%20of%20the%20tmp_table_size%20and%20max_heap_table_size.%20If%20the%20result%20set%20gest%20bigger%20than%20this%20threshold%2C%20MySQL%20will%20overflow%20to%2Ddisk%20based%20temporary%20tables.). Disk-based temporary tables increase I/O operations, leading to slower performance.

### **Lock Contention**

In a highly concurrent environment, frequent access and updates across multiple tables can lead to lock contention and further degrade performance.

**Multiple Joins**

• **Lock Types**: MySQL uses different types of locks (e.g., [shared](https://dev.mysql.com/doc/refman/8.4/en/glossary.html#glos_shared_lock), [exclusive](https://dev.mysql.com/doc/refman/8.4/en/glossary.html#glos_exclusive_lock)) depending on the operation. Complex queries with multiple joins can require various locks, leading to contention if different parts of the query need the same resources.

• **Row-Level vs. Table-Level Locks**: InnoDB uses [row-level locking](https://dev.mysql.com/doc/refman/8.4/en/internal-locking.html#internal-row-level-locking), which is generally more efficient than [table-level locking](https://dev.mysql.com/doc/refman/8.4/en/internal-locking.html#internal-table-level-locking) used by MyISAM. However, even row-level locks can cause contention if multiple transactions try to modify the same rows simultaneously.

**Joins on Joins**

• **Increased Lock Duration**: Queries involving joins on joins often take longer to execute. The longer a transaction holds locks, the higher the chance of contention with other transactions.

• **Lock Escalation**: Although InnoDB uses row-level locking, high contention can sometimes cause lock escalation, where the database engine escalates to table-level locks to manage the contention, leading to broader performance issues. [This is typically due to non-existent and/or lacking indexes](https://dev.mysql.com/doc/refman/8.4/en/innodb-locks-set.html#:~:text=If%20you%20have%20no%20indexes,scan%20more%20rows%20than%20necessary.).

**Lock Waits and Deadlocks**

• **Lock Waits**: When a transaction needs a lock held by another transaction, it must wait, leading to increased query execution time and potential timeouts.

• **Deadlocks**: Complex queries with multiple joins increase the risk of deadlocks, where two or more transactions are waiting for each other’s locks, causing the [database to automatically roll back](https://dev.mysql.com/doc/refman/8.4/en/innodb-deadlocks.html) one of the transactions to resolve the deadlock, typically the "victim" is rolled back.

## Strategies for Optimization

To mitigate performance issues in highly normalized architectures, consider the following strategies:

### Denormalization

The process for denormalizing data involves adding redundant data to tables to reduce the number of joins required. While this increases storage requirements and the risk of data anomalies, it can significantly improve read performance.

```sql
SELECT i.id, i.name, i.category_name, i.supplier_name, i.warehouse_name, i.attribute_value
FROM items_denormalized i
WHERE i.id = ?
```

In this example, the `items_denormalized` table combines data from the `categories`, `suppliers`, `warehouses`, and `item_attributes` tables, eliminating the need for multiple joins.

### Indexing

Proper indexing can dramatically improve query performance. Ensure that all columns used in joins and WHERE clauses are indexed. Remember, an index is super important to prevent full table locks. Keep in mind, that even this will not help if temporary tables are created with your joins, which will NOT have indexes.

```sql
CREATE INDEX idx_items_id ON items(id);
CREATE INDEX idx_categories_id ON categories(id);
CREATE INDEX idx_suppliers_id ON suppliers(id);
CREATE INDEX idx_warehouses_id ON warehouses(id);
CREATE INDEX idx_item_attributes_item_id ON item_attributes(item_id);
```

### Caching

Implement caching mechanisms to store frequently accessed data in memory, reducing the need for repeated database queries. There are multiple strategies for implementing caching, which will be covered in a different post, but these strategies can range from utilizing summary tables, to integrating different technologies that can store results temporarily.

```ruby
# Example using Ruby on Rails with Redis cache
item = Rails.cache.fetch("item_#{id}", expires_in: 12.hours) do
  Item.includes(:category, :supplier, :warehouse, :item_attributes).find(id)
end
```

### Query Optimization

[Analyze](https://dev.mysql.com/blog-archive/mysql-explain-analyze/) and optimize your queries to ensure they are as efficient as possible. Use tools like MySQL’s `EXPLAIN ANALYZE` statement to understand the execution plan and identify bottlenecks.

```sql
EXPLAIN SELECT i.id, i.name, c.name AS category, s.name AS supplier, w.name AS warehouse, ia.attribute_value
FROM items i
JOIN categories c ON i.category_id = c.id
JOIN suppliers s ON i.supplier_id = s.id
JOIN warehouses w ON i.warehouse_id = w.id
JOIN item_attributes ia ON i.id = ia.item_id
WHERE i.id = 1;
```

## Conclusion

Normalization is a powerful technique for maintaining data integrity, but it can lead to performance challenges in large-scale applications. Knowing the tradeoffs here can help you scale your application in the long term, considering denormalization as just another strategy to help scale. If denormalization is not favorable; consider reviewing indices (including composites), result caching and query optimization to improve performance. Thank you for reading and please reach out if you have any questions!

# References

[Microsoft 365 - Description of the database normalization basics](https://learn.microsoft.com/en-us/office/troubleshoot/access/database-normalization-description)

[Coding Horror - Maybe Normalizing Isn't Normal](https://blog.codinghorror.com/maybe-normalizing-isnt-normal/)

[informIT - When You Can't Change a SQL Database Design](https://www.informit.com/articles/article.aspx?p=2755707&seqNum=3)

[PureStorage - Denormalized vs. Normalized Data](https://blog.purestorage.com/purely-educational/denormalized-vs-normalized-data/).

[MySQL - Buffer Pool](https://dev.mysql.com/doc/refman/8.4/en/innodb-buffer-pool.html)

[MySQL - InnoDB Disk I/O](https://dev.mysql.com/doc/refman/8.4/en/innodb-disk-io.html)

[MySQL - Internal Temporary Table Use in MySQL](https://dev.mysql.com/doc/refman/8.0/en/internal-temporary-tables.html)

[MySQL - Locks Set by Different SQL Statements in InnoDB](https://dev.mysql.com/doc/refman/8.4/en/innodb-locks-set.html)

[Percona - Understanding Hash Joins in MySQL 8](https://www.percona.com/blog/understanding-hash-joins-in-mysql-8/)

[Percona - Horizontal Scaling in MySQL – Sharding Followup](https://www.percona.com/blog/horizontal-scaling-in-mysql-sharding-followup/)

[PlanetScale - How to Scale your Database and when to Shard MySQL](https://planetscale.com/blog/how-to-scale-your-database-and-when-to-shard-mysql)

[Awesome - Database Design](https://github.com/sujeet-agrahari/awesome-database-design)

[Awesome - MySQL](https://github.com/shlomi-noach/awesome-mysql#readme)