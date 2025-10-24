---
title: Optimizing Queries for Highly Normalized Architectures
date: "2024-07-21T06:54:00.000Z"
description: "We've all been taught the benefits of normalizing our data. So I won't bore you with those details, but to sum it up:  Normalization is the process of organizing data in a database. It includes creating tables and establishing relationships between t..."
tags:
---


We've all been taught the benefits of normalizing our data. So I won't bore you with those details, but to sum it up:

> Normalization is the process of organizing data in a database. It includes creating tables and establishing relationships between those tables according to rules designed both to protect the data and to make the database more flexible by eliminating redundancy and inconsistent dependency.

ref: <a href="https://learn.microsoft.com/en-us/office/troubleshoot/access/database-normalization-description" target="_blank" noopener>Description of normalization</a>

To be honest, normalization never really crossed my mind until recently when I've had to deal with multiple legacy applicationst that were "highly normalized". And when I say "highly normalized" I mean "HIGHLY NORMALIZED" - to the point where
it just doesn't make sense anymore. Which reminded me of this amazing article by Coding Horror: <a href="https://blog.codinghorror.com/maybe-normalizing-isnt-normal/" target="_blank">Maybe Normalizing Isn't Normal</a>.

The problem is that, unless you're really _lucky_, you won't need to worry about things like this. So, let's try and replicate the issue and understand how we can work around it - if at all.

### The Scenario

You're working on an established legacy, large-scale inventory management system. The system needs to display a list of inventory items, and each inventory item has a category, supplier, warehouse and various attributes.

Here’s a simplified schema:

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

### Seeding Data

For any performance work we do, it's important to be able to reproduce the scale we're anticipating in order to get a good idea of how our application will perform.

That's why I've put together the following seeding script:

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

  item_attributes = 1_000_000.times.map do
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

This seeding script helps create records for all our entities. The above can be fine tuned to create more or less records to stress test the architecture.

Now, remember, this will be running on your local computer so we're not testing production level resources here. Obviously if you go with a largest RDS instance
you're going to get really good performance - however, it will always be a matter of time until performance issues creep up if you don't manage your database
over time.

For this article, the above should be good enough to get us going in understanding how normalization can impact our queries performance with a practical perspective.

The only change I'm going to make to the above seeding script is lowering the number of item attributes for our first example showing no issues with normalization.
Let's go with 100,000 attributes

```ruby
  item_attributes = 100_000.times.map do
    {
      attribute_name: Faker::Lorem.word,
      attribute_value: Faker::Lorem.word,
      item_id: items.sample.id
    }
  end
```

When we run the seeds, we'll get the following logs:

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

Alright, let's start running some queries.

### Peformance? What peformance?!

So, let's say I want all items except those from McDermott-Casper, a supplier who has gone bankrupt.

![](/images/how-to-optimize-queries-for-highly-normalized-databases/suppliers.png)

Also, I don't want items that have the attributes enim and/or modi associated to them:

![](/images/how-to-optimize-queries-for-highly-normalized-databases/item_attributes.png)

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

The conditions to exclude items based on our scenario are utilized in the WHERE conditionals as embedded subqueries, while we join category,
supplier, warehouse and (left outer join) item attributes to ensure that we retrieve only the matching items of our condition.

Alright, let's test this out:

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

Awesome! We're at sub-second fetches.

Alright. Let's see what happens when we bump up the number of attributes in the system to...lets say a million.

Now keep in mind that the above had 1,187 item attribute records that matched enim or modi.

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
irb(main):011>
irb(main):012> Item
irb(main):013>   .distinct
irb(main):014>   .select('items.id, items.name, categories.name AS category_name, suppliers.name AS supplier_name, warehouses.name AS warehouse_name')
irb(main):015>   .joins(:category, :supplier, :warehouse)
irb(main):016>   .left_outer_joins(:item_attributes)
irb(main):017>   .where("items.supplier_id NOT IN (#{excluded_suppliers})")
irb(main):018>   .where("items.id NOT IN(#{excluded_attributes})")
irb(main):019>   .to_a
  Item Load (3249.5ms)  SELECT DISTINCT items.id, items.name, categories.name AS category_name, suppliers.name AS supplier_name, warehouses.name AS warehouse_name FROM "items" INNER JOIN "categories" ON "categories"."id" = "items"."category_id" INNER JOIN "suppliers" ON "suppliers"."id" = "items"."supplier_id" INNER JOIN "warehouses" ON "warehouses"."id" = "items"."warehouse_id" LEFT OUTER JOIN "item_attributes" ON "item_attributes"."item_id" = "items"."id" WHERE (items.supplier_id NOT IN (SELECT "suppliers"."id" FROM "suppliers" WHERE "suppliers"."name" = 'McDermott-Casper')) AND (items.id NOT IN(SELECT "item_attributes"."item_id" FROM "item_attribute
```

Whoa! Ok. Now we're at 3.2s.

The problem will only get worse as more items are added to the system over time and in relation item_attributes will continue to impact this specific query.

When 900,000 more attributes were added there was an increase of the number of records that matched enim or modi. In fact we went from 1,187 to 12,154 records.

This kind of scale is completely normal and really shouldn't be unexpected. As the number of attributes for items can increase significantly over time in an inventory management system for all sorts of reasons.

### Is normalization really the issue here?

To answer the question of whether normalization is the issue with this scenario, let's test it out.

I'm going to remove the joins to categories and warehouses:

```ruby
irb(main):029>         Item
irb(main):030>           .distinct
irb(main):031>           .select('/* PERF_METRIC */ items.id, items.name, suppliers.name AS supplier_name')
irb(main):032>           .joins(:supplier)
irb(main):033>           .left_outer_joins(:item_attributes)
irb(main):034>           .where("items.supplier_id NOT IN (#{excluded_suppliers})")
irb(main):035>           .where("items.id NOT IN(#{excluded_attributes})")
irb(main):036>           .to_a
irb(main):037>
  Item Load (1938.4ms)  SELECT DISTINCT /* PERF_METRIC */ items.id, items.name, suppliers.name AS supplier_name FROM "items" INNER JOIN "suppliers" ON "suppliers"."id" = "items"."supplier_id" LEFT OUTER JOIN "item_attributes" ON "item_attributes"."item_id" = "items"."id" WHERE (items.supplier_id NOT IN (SELECT "suppliers"."id" FROM "suppliers" WHERE "suppliers"."name" = 'McDermott-Casper')) AND (items.id NOT IN(SELECT "item_attributes"."item_id" FROM "item_attributes" WHERE "item_attributes"."attribute_name" IN ('enim', 'modi')))
=>
```

Wait. Did we just go from 3.2s to 1.9s here?!

Yes, yes we did. Let's look at the explanation before we removed the joins:

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

The plan above is essentially telling us the output of each join is funneled into the next one:

(items <> warehouses) -> (items <> suppliers) -> (items <> categories)

Because of the multiple joins, we essentially increase the performance impact as more data is
spread out across your database, e.g. normalization.

Now, let's look at the plan after we remove the joins:

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

Well, let's see what this looks like using the denormalized table items_denormalized to achieve a similar result without the join.


### Performance Bottlenecks

Normalized databases can introduce several performance bottlenecks, particularly in large-scale applications:

1. **Complex Queries:** Highly normalized schemas often require complex queries with multiple joins, which can be slow and resource-intensive.
2. **Increased I/O Operations:** Each table lookup can lead to additional I/O operations, slowing down the overall query performance.
3. **Lock Contention:** In a highly concurrent environment, frequent access and updates across multiple tables can lead to lock contention and further degrade performance.

### Example Query

Consider a query to fetch the details of inventory items along with their categories, suppliers, and warehouse locations:

```sql
SELECT i.id, i.name, c.name AS category, s.name AS supplier, w.name AS warehouse, ia.attribute_value
FROM items i
JOIN categories c ON i.category_id = c.id
JOIN suppliers s ON i.supplier_id = s.id
JOIN warehouses w ON i.warehouse_id = w.id
JOIN item_attributes ia ON i.id = ia.item_id
WHERE i.id = ?
```

### Strategies for Optimization

To mitigate performance issues in highly normalized architectures, consider the following strategies:

#### Denormalization

The process for denormalizing data involves adding redundant data to tables to reduce the number of joins required. While this increases storage requirements and the risk of data anomalies, it can significantly improve read performance.

```sql
SELECT i.id, i.name, i.category_name, i.supplier_name, i.warehouse_name, i.attribute_value
FROM items_denormalized i
WHERE i.id = ?
```

In this example, the `items_denormalized` table combines data from the `categories`, `suppliers`, `warehouses`, and `item_attributes` tables, eliminating the need for multiple joins.

#### Indexing

Proper indexing can dramatically improve query performance. Ensure that all columns used in joins and WHERE clauses are indexed.

```sql
CREATE INDEX idx_items_id ON items(id);
CREATE INDEX idx_categories_id ON categories(id);
CREATE INDEX idx_suppliers_id ON suppliers(id);
CREATE INDEX idx_warehouses_id ON warehouses(id);
CREATE INDEX idx_item_attributes_item_id ON item_attributes(item_id);
```

#### Caching

Implement caching mechanisms to store frequently accessed data in memory, reducing the need for repeated database queries.

```ruby
# Example using Ruby on Rails with Redis cache
item = Rails.cache.fetch("item_#{id}", expires_in: 12.hours) do
  Item.includes(:category, :supplier, :warehouse, :item_attributes).find(id)
end
```

#### Query Optimization

Analyze and optimize your queries to ensure they are as efficient as possible. Use tools like MySQL’s `EXPLAIN` statement to understand the execution plan and identify bottlenecks.

```sql
EXPLAIN SELECT i.id, i.name, c.name AS category, s.name AS supplier, w.name AS warehouse, ia.attribute_value
FROM items i
JOIN categories c ON i.category_id = c.id
JOIN suppliers s ON i.supplier_id = s.id
JOIN warehouses w ON i.warehouse_id = w.id
JOIN item_attributes ia ON i.id = ia.item_id
WHERE i.id = 1;
```

#### Database Sharding

For extremely large datasets, consider sharding your database to distribute the load across multiple servers, reducing the performance impact of highly normalized architectures.

### Building Efficient Queries with ActiveRecord and Query Builder Pattern

Using ActiveRecord in Rails, we can build efficient queries while adhering to the principles mentioned above. Here’s how we can approach this:

#### Denormalization Example

Assuming we have a denormalized `items` table:

```ruby
class Item < ApplicationRecord
  # No associations needed due to denormalization
end

item = Item.find(params[:id])
```

#### Indexing

Ensure proper indexing in your migrations:

```ruby
class AddIndexesToItems < ActiveRecord::Migration[6.1]
  def change
    add_index :items, :id
    add_index :categories, :id
    add_index :suppliers, :id
    add_index :warehouses, :id
    add_index :item_attributes, :item_id
  end
end
```

#### Caching Example

Using Rails cache to store and retrieve data:

```ruby
item = Rails.cache.fetch("item_#{params[:id]}", expires_in: 12.hours) do
  Item.includes(:category, :supplier, :warehouse, :item_attributes).find(params[:id])
end
```

#### Query Builder Pattern

Implementing a query builder for more complex query needs:

```ruby
class ItemQuery
  def initialize(relation = Item.all)
    @relation = relation
  end

  def with_associations
    @relation = @relation.includes(:category, :supplier, :warehouse, :item_attributes)
    self
  end

  def find_by_id(id)
    @relation = @relation.where(id: id)
    self
  end

  def result
    @relation.first
  end
end

item = ItemQuery.new.with_associations.find_by_id(params[:id]).result
```

### Conclusion

Normalization is a powerful technique for maintaining data integrity, but it can lead to performance challenges in large-scale applications. By employing strategies such as denormalization, indexing, caching, query optimization, and sharding, you can significantly improve query performance. Utilizing ActiveRecord with a query builder pattern can further streamline the process, allowing for efficient and maintainable code.
