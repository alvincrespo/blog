---
title: Testing ViewComponent w/ Capybara
date: "2024-08-13T11:00:33.939Z"
description: "Today I was writing some tests and dug into a little bit of ViewComponent and Capybara. Most of time you read a tutorial and just kind of get whatever done, here I'm going to explain in detail what my test is doing and why it's important.  💡 If you'..."
tags:
---

Today I was writing some tests and dug into a little bit of ViewComponent and Capybara. Most of time you read a tutorial and just kind of get whatever done, here I'm going to explain in detail what my test is doing and why it's important.

<div data-node-type="callout">
<div data-node-type="callout-emoji">💡</div>
<div data-node-type="callout-text">If you're using the <a target="_blank" rel="noopener noreferrer nofollow" href="https://trix-editor.org/" style="pointer-events: none">Trix</a> editor, I also show you how to test your view components with a nice helper inspired by <a target="_blank" rel="noopener noreferrer nofollow" href="https://medium.com/@thinkolson" style="pointer-events: none">Will Olson's</a> article <a target="_blank" rel="noopener noreferrer nofollow" href="https://medium.com/eighty-twenty/testing-the-trix-editor-with-capybara-and-minitest-158f895ad15f" style="pointer-events: none"><strong>Testing the Trix Editor with Capybara and MiniTest</strong></a><strong>.</strong></div>
</div>

---

## Setup

Here you'll see the component, it's template and associated test. This component is responsible for rendering out a form that can be used in multiple parts of an application; including `/notes`, `garden/:id/notes` and `/garden/:garden_id/plants/:plant_id/notes`. To support this usage, we pass in `form_options` to the component that then gets used by the `form_with` view helper.

To keep this article simple, we're just going to verify the form renders the title, summary and body of a note.

**Component**

```ruby
# app/components/note_form_component.rb

# frozen_string_literal: true

class NoteFormComponent < ViewComponent::Base
  delegate :rich_text_area_tag, to: :helpers

  def initialize(form_options:)
    super

    @form_options = form_options
  end
end
```

**Template**

```erb
<%# app/components/note_form_component.html.erb  %>

<%= form_with(**@form_options) do |form| %>
  <div class="field">
    <%= form.label :title %>
    <%= form.text_field :title, autofocus: :true, class: "input" %>
  </div>

  <div class="field">
    <%= form.label :summary %>
    <%= form.text_area :summary %>
  </div>

  <div class="field">
    <%= form.label :body %>
    <%= form.rich_text_area :body %>
  </div>

  <div class="flex flex-row-reverse items-center mt-8">
    <%= form.submit %>
    <%= link_to "Cancel Note", :back, class: "mr-4" %>
  </div>
<% end %>
```

**Test**

```ruby
# test/components/note_form_component_test.rb

require 'test_helper'

class NoteFormComponentTest < ViewComponent::TestCase
  def form_options
    { form_options: { model: Note.new, url: '/notes', local: true } }
  end

  def test_component_renders_form_with_title_field
      # assert the hell out of this
  end
end
```

---

## ViewComponent + Capybara

The ViewComponent docs mention that we can use Capybara in our specs and I want specifically want to use [`assert_selector`](https://rubydoc.info/github/jnicklas/capybara/Capybara/Node/Matchers#assert_selector-instance_method) to verify the contents of my components are rendered.

<div data-node-type="callout">
<div data-node-type="callout-emoji">📕</div>
<div data-node-type="callout-text"><code>assert_selector</code> is a "Matcher" in Capybara. It asserts that an element is found at lease once.</div>
</div>

To verify that all my elements are within a "form", I'm going to use `assert_selector` with a block and then verify all my elements are within it. This is done like so:

```ruby

  assert_selector 'form' do
      # assert a form field
  end
```

Let's start with the title of the note:

```ruby
  assert_selector 'form' do
    assert_selector :field, name: 'title'
  end
```

Ah, we have a few things going on here:

1. `assert_selector` can be used in different ways
    
2. There is a `field` type of selector
    
3. We can pass attributes to verify a field
    

The documentation for `assert_selector` states the following:

```plaintext
assert_selector(*args, &optional_filter_block) ⇒ Object

Parameters:
kind (Symbol) — Optional selector type (:css, :xpath, :field, etc.). Defaults to default_selector.
locator (String) — The locator for the specified selector
options (Hash) — a customizable set of options
```

The `kind` parameter defaults to something called `default_selector`, which is defined by `Capybara::Selector`. It turns out we can make our assertions cleaner by using `:field` as our selector:

```plaintext
:field - Select field elements (input [not of type submit, image, or hidden], textarea, select)
Locator: Matches against the id, test_id attribute, name, placeholder, or associated label text
Filters:
:name (String, Regexp) - Matches the name attribute
:placeholder (String, Regexp) - Matches the placeholder attribute
:type (String) - Matches the type attribute of the field or element type for 'textarea' and 'select'
:readonly (Boolean) - Match on the element being readonly
:with (String, Regexp) - Matches the current value of the field
:checked (Boolean) - Match checked fields?
:unchecked (Boolean) - Match unchecked fields?
:disabled (Boolean, :all) - Match disabled field? (Default: false)
:multiple (Boolean) - Match fields that accept multiple values
:valid (Boolean) - Match fields that are valid/invalid according to HTML5 form validation
:validation_message (String, Regexp) - Matches the elements current validationMessage
```

We can also use `:button` to verify the submit button renders correctly:

```plaintext
:button - Find buttons ( input [of type submit, reset, image, button] or button elements )
Locator: Matches the id, test_id attribute, name, value, or title attributes, string content of a button, or the alt attribute of an image type button or of a descendant image of a button
Filters:
:name (String, Regexp) - Matches the name attribute
:title (String) - Matches the title attribute
:value (String) - Matches the value of an input button
:type (String) - Matches the type attribute
:disabled (Boolean, :all) - Match disabled buttons (Default: false)
```

Using `name` to identify the field's we want to verify, we will have the following assertions:

```ruby

# Verify the title field
assert_selector 'form' do
  assert_selector :field, name: 'title'
end

# Verify the submit button
assert_selector 'form' do
  assert_selector :button, name: 'commit'
end
```

However, we have an issue. Path helpers don't work with view components, so using `notes_path` or `notes_urls` wouldn't work if we passed it in with `form_options`. To prevent the `ActionController::UrlGenerationError` error, we then need to wrap our assertions with `with_request_url`. Let's keep it simple and hardcode the url it:

```ruby
with_request_url '/notes/new' do
  render_inline(NoteFormComponent.new(form_options:))

  assert_selector 'form' do
    assert_selector :field, name: 'title'
  end
end
```

---

## Custom Assertions

As a bonus to this article, we're going to write a helper we can use to assert that the trix editor is rendered within our view component. Let's create a `capybara_helpers.rb` file and place it in `test/support`. You might need to create the `support` directory as it's not a default with built-in Rails usage of Minitest.

```ruby
# test/support/capybara_helpers.rb

def assert_trix_editor(id)
  assert_selector(:xpath, "//*[@id='#{id}']", visible: false)
end
```

Once you've got the helper written, we need to ensure that we load this file in, we can do that in `test_helpers.rb`:

```ruby
# test/test_helper.rb

Dir["#{File.dirname(__FILE__)}/support/**/*.rb"].each { |f| require f }
```

Place this before the `module ActiveSupport`:

```ruby
ENV['RAILS_ENV'] ||= 'test'

require_relative '../config/environment'
require 'rails/test_help'

Dir["#{File.dirname(__FILE__)}/support/**/*.rb"].each { |f| require f }

module ActiveSupport
  class TestCase
    # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
    fixtures :all
    # Add more helper methods to be used by all tests here...
  end
end
```

Now that we have our capybara helpers being loaded, we can utilize it similarly to our previous assertions:

```ruby
with_request_url '/notes/new' do
  assert_selector 'form' do
    assert_trix_editor 'body'
  end
end
```

The final product of our test's will look something like this:

```ruby
# test/components/note_form_component_test.rb

require 'test_helper'

class NoteFormComponentTest < ViewComponent::TestCase
  def form_options
    { form_options: { model: Note.new, url: '/notes', local: true } }
  end

  def test_component_renders_form_with_title_field
    with_request_url '/notes/new' do
      render_inline(NoteFormComponent.new(form_options:))

      assert_selector 'form' do
        assert_selector :field, name: 'title'
      end
    end
  end

  def test_component_renders_form_with_summary_field
    with_request_url '/notes/new' do
      render_inline(NoteFormComponent.new(form_options:))

      assert_selector 'form' do
        assert_selector :field, name: 'summary'
      end
    end
  end

  def test_component_renders_form_with_content_field
    with_request_url '/notes/new' do
      render_inline(NoteFormComponent.new(form_options:))

      assert_selector 'form' do
        assert_trix_editor 'body'
      end
    end
  end

  def test_component_renders_form_with_submit_button
    with_request_url '/notes/new' do
      render_inline(NoteFormComponent.new(form_options:))

      assert_selector 'form' do
        assert_selector :button, name: 'commit'
      end
    end
  end
end
```

---

## Conclusion

ViewComponent + Capybara is a perfect match for declaratively writing tests that verify your components state. This example is straightforward in that it only tests the default state of the form, but it demonstrates how simple it to write integration tests. These tests can be extended to use [fill\_in](https://www.rubydoc.info/gems/capybara/Capybara/Node/Actions:fill_in) and [click\_button](https://www.rubydoc.info/gems/capybara/Capybara%2FNode%2FActions:click_button) to ensure functionality. Why don't you give it a try? 🙂

---

## References

[Testing the Trix Editor with Capybara and MiniTest](https://medium.com/eighty-twenty/testing-the-trix-editor-with-capybara-and-minitest-158f895ad15f)

[Capybara::Node::Matchers#assert\_selector](https://rubydoc.info/github/jnicklas/capybara/Capybara/Node/Matchers#assert_selector-instance_method)

[Capybara::Selector](https://rubydoc.info/github/jnicklas/capybara/Capybara/Selector)

[ViewComponent - Testing](https://viewcomponent.org/guide/testing.html)