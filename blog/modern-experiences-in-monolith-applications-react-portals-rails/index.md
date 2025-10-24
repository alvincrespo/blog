---
title: Modern Experiences in Monolith Applications — React Portals + Rails
date: "2019-11-09T11:30:00.000Z"
description: "This was originally published on Echobind's Blog. If you haven't checked out our plethora of knowledge and skillz - check it here.  You’re probably thinking — “Build it as a SPA and create a separate API” Not today. Sometimes, you just want to be abl..."
tags:
---


> This was originally published on [Echobind's Blog](https://blog.echobind.com/managing-react-components-in-a-monolith-application-6d88a5168f1f). If you haven't checked
> out our plethora of knowledge and skillz - check it [here](https://blog.echobind.com/).

You’re probably thinking — “Build it as a SPA and create a separate API”

Not today.

Sometimes, you just want to be able to use modern front-end development tools along with a traditional monolith application. The reality is that, if you want to get going quickly — use what you know. If what you know best is building out apps in monolith architecture, this article is for you.

If you’re interested in jumping into the code immediately — feel free to do so [here](https://github.com/alvincrespo/react-portals-in-rails).

## Architecture

Typically in a single page application, you have XHR requests being made, replacing a full-page refresh. Depending on your monolith application (Rails, Spring, etc…), your implementation will differ. However, in our sample application — what we’re essentially doing is building out a form that will then submit and do a page refresh.

The aspect of building out a form is essentially creating the data needed inline without having to do a full page refresh. If you’re coming from the single page app world, traditionally a flow would look like:

- Visit root URL
- Click “Create User”
- Fill In “Email”
- Fill In “Password”
- Click “Create User”

All of the above would happen seamlessly.

In a monolith application, this would look like:

- Visit root URL
- Click “Create User”
- [Page Refresh — User is taken to /users/new]
- Fill “Email”
- Fill In “Password”
- Click “Create User”
- [Page Refresh — User is taken to ]

The additional [Page Refresh] indicates that state is being managed on the backend for rendering the next page of your app.

So, how can we create a seamless experience within a monolith?

We can build out those experiences inline to a page using [React Portals](https://reactjs.org/docs/portals.html).

## What are React Portals?

The official React [docs](https://reactjs.org/docs/portals.html) define them as:

> Portals provide a first-class way to render children into a DOM node that exists outside the DOM hierarchy of the parent component.

That’s a fancy way of saying:

> Render React components into specific DOM nodes on a page.

So, if we had the following HTML structure:

```html
<div class="container">
  <div id="portal-action"></div>
</div>
```

And defined a component like this:

```jsx
const FormAction = ({ onClick }) =>
  ReactDOM.createPortal(
    <button type="button" onClick={onClick}>
      New User
    </button>,
    document.getElementById("portal-action")
  )
```

We would be rendering a button within a div on the page that has an id of portal-action.

The rendered version would look something like this:

```html
<div class="container">
  <div id="portal-action">
    <button type="button">New User</button>
  </div>
</div>
```

## Implementing a React Portal Manager

Alright, so we know that we can render react components anywhere on the page. That gives us the flexibility to target what’s been rendered from the server and inject an experience we would like to augment.

So, how do we manage our portals?

```jsx
const FormManager = () => {
  const [displayForm, setDisplayForm] = useState(false)
  const [users, setUsers] = useState([])
  const onSave = (user) => {
    setUsers([user, ...users])
    setDisplayForm(false)
  }
  const onCancel = () => {
    setDisplayForm(false)
  }
  return (
    <>
      <FormAction onClick={() => setDisplayForm(true)} />
      <FormRenderer display={displayForm} onSave={onSave} onCancel={onCancel} />
      <FormResultsRenderer users={users} />
    </>
  )
}
```

In the above code, we are:

1. Setting up state (you might consider this your global state)
1. Defining some actions taken from child components
1. Rendering 3 different components

Each of these “wrapper” components, will only handle rendering that single component within a spot in your HTML:

```jsx
const FormRenderer = ({ display, onSave, onCancel }) => {
  if (!display) return null
  return ReactDOM.createPortal(
    <NewUserForm onSave={onSave} onCancel={onCancel} />,
    document.getElementById("portal-form")
  )
}
```

In this `FormRenderer`, we're returning a portal created at `portal-form`. This same component is handling whether it should be displayed, returning `null` if it shouldn't.

Hooking up the plumbing

The key to all of this is to allow a seamless experience that essentially builds up what you need for that last step — submitting your information for the backend to process.

```jsx
const FormResultsRenderer = ({ users }) => {
  if (users.length === 0) return null
  return ReactDOM.createPortal(
    <form action="/users" acceptCharset="UTF-8" method="post">
      <input
        type="hidden"
        name="authenticity_token"
        value={document.head.querySelector('[name="csrf-token"]').content}
      ></input>
      <ul>
        {users.map((u) => (
          <li key={`user/${Date.now()}`}>
            {u.user_name}
            <input
              type="text"
              name="user[name]"
              value={u.user_name}
              hidden
              readOnly
            />
            <input
              type="text"
              name="user[birthdate]"
              value={u.user_birthdate}
              hidden
              readOnly
            />
          </li>
        ))}
      </ul>
      <button type="submit">Create Users</button>
    </form>,
    document.getElementById("portal-results")
  )
}
```

We’re essentially creating some hidden inputs that get submitted to the server. Still scratching your head? Simply put:

We’ve created a fancy schmancy form builder

This requires that you know a little bit about how your monolith app works. For example, the above renderer creates the following input:

```html
<input type="text" name="user[name]" value="{u.user_name}" hidden readonly />
```

The name of this input is important, `user[name]`, because this is how Rails standardizes its forms for consumption by its controller actions by default. If we wanted to customize that name, we would need to update our controller/actions appropriately to look for that custom name in its parameters.

_Either way, the idea here is to use a solid foundation (Rails) with the latest modern UI development practices (React)_. In this manner, you have a standard way of building an app — but are not limited in building out complex user interactions.

If you’re looking for an example, you can check out a sample implementation [here](https://github.com/alvincrespo/react-portals-in-rails).

<hr>

I hope you’ve found this useful. Let me know your thoughts in the comments section below and remember to hit that clap button to your left.

Cheers!
