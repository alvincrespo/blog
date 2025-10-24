---
title: Integrating Stripe Webhooks in Ruby on Rails
date: "2025-04-18T22:59:24.554Z"
description: "Handling subscription payments is a common requirement for many modern web applications. Stripe is one of the most popular payment processing services, and their webhook system allows your application to respond to events happening within the Stripe ..."
tags:
---

Handling subscription payments is a common requirement for many modern web applications. Stripe is one of the most popular payment processing services, and their webhook system allows your application to respond to events happening within the Stripe ecosystem. In this post, I'll walk you through integrating Stripe webhooks into a Rails application to handle subscription updates.

## What are Webhooks?

Before diving into the code, let's understand what [webhooks](https://www.redhat.com/en/topics/automation/what-is-a-webhook) are. Simply put, webhooks are automated messages sent from one application to another when certain events occur. In our case, Stripe will send notifications to our application when events like subscription updates happen. For example, if you are using Stripe’s built-in [Customer Portal](https://docs.stripe.com/customer-management) feature, you may want to be aware of any updates in your application.

## The Story

For this walkthrough, let’s look at the following acceptance criteria:

> As a user whose ***free trial*** has ended
> 
> I would like to upgrade to the ***Basic - Monthly* plan** in the Customer Portal
> 
> When I upgrade to the **Basic - Monthly plan**, I want to see that change in my user settings.

There is another set of related acceptance criteria:

> As a customer support person, in the process of upgrading a persons subscription
> 
> I would like to upgrade their subscription in Stripes Dashboard
> 
> And when the customer logs in, they should see their subscription updated in their user settings.

Both these stories have something in common: an event has taken place outside the main application and our application needs to know about it.

The approach here then, is to do a simple integration with [Stripes Webhooks](https://docs.stripe.com/webhooks). We’ll capture a specific event related to a subscription change on the user and then update our database.

## Prerequisites

For this tutorial, you'll need:

* A Ruby on Rails application
    
* A Stripe account with API keys
    
* Basic understanding of Rails models and controllers
    

## Setting Up Your Models

Our application needs to track users and their subscriptions. We'll use three models:

1. `User` - Represents a customer using **our** application
    
2. `Subscription` - Represents a subscription plan in Stripe
    
3. `SubscriptionUser` - A join model connecting users and subscriptions
    

```ruby
# app/models/user.rb

class User < ApplicationRecord
  has_one :subscription_user
  has_one :subscription, through: :subscription_user
  
  # This method will be called by our webhook
  def self.update_subscription(stripe_subscription)
    user = User.find_by(stripe_id: stripe_subscription.customer)
    subscription = Subscription.find_by(stripe_price_id: stripe_subscription.plan.id)
    
    Rails.logger.error("Subscription not found for stripe_price_id: #{stripe_subscription.plan.id}") if subscription.blank?
    
    return if user.blank? || subscription.blank?
    
    user.subscription_user.update(
      subscription: subscription,
      stripe_product_id: stripe_subscription.plan.product,
      stripe_subscription_id: stripe_subscription.id
    )
  end
end

# app/models/subscription.rb

class Subscription < ApplicationRecord
  has_and_belongs_to_many :users
end

# app/models/subscription_user.rb

class SubscriptionUser < ApplicationRecord
  self.table_name = "subscriptions_users"
  
  belongs_to :user
  belongs_to :subscription
end
```

<div data-node-type="callout">
<div data-node-type="callout-emoji">💡</div>
<div data-node-type="callout-text">Note that we have created a <code>User#update_subscription</code> class method that takes the subscription response from Stripe that we can then leverage to find the user, corresponding subscription and associate them on our join <code>subscriptions_users</code> table. Also, the <code>stripe_subscription</code> is the <a target="_self" rel="noopener noreferrer nofollow" href="https://docs.stripe.com/api/subscriptions/object" style="pointer-events: none">subscription object</a> from Stripe.</div>
</div>

## Creating the Webhooks Controller

Next, we'll create a controller to handle incoming webhook event [**customer.subscription.updated**](https://docs.stripe.com/api/events/types#event_types-customer.subscription.updated) from Stripe:

```ruby
# app/controllers/webhooks_controller.rb

class WebhooksController < ApplicationController
  before_action :setup_event, only: [:stripe]
  before_action :setup_payload, only: [:stripe]
  before_action :setup_signature_header, only: [:stripe]
  before_action :setup_endpoint_secret, only: [:stripe]

  def stripe
    begin
      @event = Stripe::Webhook.construct_event(
        @payload, @signature_header, @endpoint_secret
      )
    rescue JSON::ParserError => _e
      render json: { error: "Invalid payload" }, status: 400 and return
    rescue Stripe::SignatureVerificationError => _e
      render json: { error: "Invalid signature" }, status: 400 and return
    end

    handle_event

    render json: { message: "Success" }, status: 200
  end

  private

  def setup_event
    @event = nil
  end

  def setup_payload
    @payload = request.body.read
  end

  def setup_signature_header
    @signature_header = request.env["HTTP_STRIPE_SIGNATURE"]
  end

  def setup_endpoint_secret
    @endpoint_secret = ENV["STRIPE_WEBHOOK_SECRET"]
  end

  def handle_event
    case @event.type
    when "customer.subscription.updated"
      handle_subscription_updated(@event.data.object)
    else
      Rails.logger.info("Unhandled event type: #{@event.type}")
    end
  end

  def handle_subscription_updated(subscription)
    User.update_subscription(subscription)
  end
end
```

<div data-node-type="callout">
<div data-node-type="callout-emoji">💡</div>
<div data-node-type="callout-text">The controller is pretty straightforward here. The important piece is <code>Stripe::Webhook.construct_event</code>. This method creates an object that normalizes the JSON string sent over by Stripe. This creates an instance of <code>Stripe::Event</code> , we then tap into the <code>data</code> property. The <code>data</code> property is an instance of <code>Stripe::Event::Data</code>. From there we retrieve the <a target="_self" rel="noopener noreferrer nofollow" href="https://docs.stripe.com/api/subscriptions/object" style="pointer-events: none">Subscription object</a> via the <code>object</code> property on <code>data</code>.</div>
</div>

## Configure Routes

Add the webhook endpoint to your routes:

```ruby
# config/routes.rb

Rails.application.routes.draw do
  # other routes...
  post 'webhooks/stripe', to: 'webhooks#stripe'
end
```

## Security Considerations

Stripe uses a signature verification system to ensure that webhook events are actually coming from Stripe. The `Stripe::Webhook.construct_event` method verifies this signature. You'll need to set the `STRIPE_WEBHOOK_SECRET` environment variable with your webhook signing secret from the Stripe dashboard.

## Testing

Testing webhooks can be challenging since they involve external services. Here's a test example that mocks a Stripe webhook event:

```ruby
# test/controllers/webhooks_controller_test.rb
require "test_helper"
require "mocha/minitest"

class WebhooksControllerTest < ActionDispatch::IntegrationTest
  SECRET = "whsec_test_secret"

  setup do
    @user = users(:user_in_free_trial)
  end

  test "handle_subscription_updated updates subscription_user when user exists" do
    payload = {
      id: "evt_123",
      object: "event",
      type: "customer.subscription.updated",
      data: {
        object: {
          customer: @user.stripe_id,
          plan: { id: "price_def456", product: "prod_12345678901" },
          id: "sub_123"
        }
      }
    }.to_json

    ClimateControl.modify STRIPE_WEBHOOK_SECRET: SECRET do
      assert_equal "Free Trial", @user.subscription.name

      post webhooks_stripe_url, params: payload, headers: compute_headers(payload)

      @user.reload

      assert_equal "Basic - Monthly", @user.subscription.display_name
    end
  end

  def compute_headers(payload)
    {
      "Content-Type": "application/json",
      "HTTP_STRIPE_SIGNATURE": compute_signature(payload)
    }
  end

  def compute_signature(payload)
    timestamp = Time.now
    timestamped_payload = "#{timestamp.to_i}.#{payload}"
    scheme = "v1"
    signature = OpenSSL::HMAC.hexdigest(OpenSSL::Digest.new("sha256"), SECRET, timestamped_payload)

    "t=#{timestamp.to_i},#{scheme}=#{signature}"
  end
end
```

<div data-node-type="callout">
<div data-node-type="callout-emoji">💡</div>
<div data-node-type="callout-text">This test verifies that a users subscription is updated without having to mock <code>Stripe::Webhook.construct_event</code>, which is a common practice. However, it is a good idea to minimize the amount of mocking for such a critical piece of an application. To ensure the method runs smoothly, I’ve implemented a <code>compute_signature</code>, which generates a valid header value to check against. The generation of the signature itself can be found in Stripe’s library at <code>Stripe::Signature#generate_header</code>. More info can be found in the reference section below.</div>
</div>

## Common Issues and Solutions

1. **Missing Environment Variables**: Ensure that your `STRIPE_WEBHOOK_SECRET` is correctly set in all environments.
    
2. **Incorrect Signature**: Double-check that you're using the correct signing secret from Stripe.
    
3. **Outdated Stripe API Version**: Make sure your Stripe gem is up to date.
    
4. **Event Duplication**: Stripe may send the same event multiple times. Your code should be idempotent (able to handle the same event multiple times without side effects).
    

## Conclusion

Integrating Stripe webhooks into your Rails application allows you to respond to payment events in real-time. This approach is more reliable than polling the Stripe API since it ensures you never miss an event. The implementation we've covered handles subscription updates, but you can easily extend it to handle other event types like `payment_intent.succeeded` or `invoice.payment_failed` . Remember to test your integration and keep it future proof by minimizing how much you mock the Stripe library. Happy coding!

---

## References

[The Subscription object](https://docs.stripe.com/api/subscriptions/object)

[Class: Stripe::Event](https://www.rubydoc.info/gems/stripe/Stripe/Event)

[Class: Stripe::Event::Data](https://www.rubydoc.info/gems/stripe/Stripe/Event/Data)

[customer.subscription.updated](https://docs.stripe.com/api/events/types#event_types-customer.subscription.updated)

[stripe-ruby/test/stripe /webhook\_test.rb](https://github.com/stripe/stripe-ruby/blob/master/test/stripe/webhook_test.rb#L14-L25)

[stripe-ruby/lib/stripe /webhook.rb#generate\_header](https://github.com/stripe/stripe-ruby/blob/master/lib/stripe/webhook.rb#L48-L57)