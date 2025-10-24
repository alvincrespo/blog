---
title: Declarative Components in React
date: "2017-10-30T16:00:00.000Z"
description: "This article was originally written for Echobind here https://medium.com/theechobind/declarative-components-in-react-b21ced9895b5  Earlier this year, I wrote about composing react components through property transference. At the time that I wrote tha..."
tags:
---

---

This article was originally written for Echobind here [https://medium.com/theechobind/declarative-components-in-react-b21ced9895b5](https://medium.com/theechobind/declarative-components-in-react-b21ced9895b5)

---

Earlier this year, I wrote about [composing react components through property transference](https://blog.echobind.com/composing-react-components-through-property-transference-d8bc2dbecef5). At the time that I wrote that article, I was exploring how to make my components flexible across multiple apps while at the same time making it easy to read and customize for various use cases. Now, after a lot of research and experimentation, I think I found a good path forward — functions as children.

# **Some Background**

A common problem development teams hit is having to reuse components in slightly different ways. This usually comes about when the design/ux team requests that the same component’s functionality be reused but laid out differently.

In Ember, the solution is called [contextual components](https://guides.emberjs.com/v2.16.0/components/wrapping-content-in-a-component/), and they look a little like this:

```plaintext
{{#ac-form as |form|}}
  <h2>Sign in</h2>
  {{form.field-email}}
  {{form.field-password}}
  <div class="actions">
    <button type="submit">Sign in</button>
  </div>
{{/ac-form}}

{{#ac-form as |form|}}
  <h2>Add User</h2>
  {{#form.field as |field|}}
    {{#field.label}}First Name{{/field.label}}
    {{field.input type="text"}}
  {{/form.field}}
  {{form.field-email}}
  {{form.field-password}}
  <div class="actions">
    <button type="submit">Register User</button>
  </div>
{{/ac-form}}
```

In the above example, there are primitives we can use to compose a form:

* Form
    
* Form Field
    
* Form Email Field
    
* Form Password Field
    

These primitives allow you to reuse **functionality** in the application. For example, the email field component comes with email validation, and the password field component encapsulate the requirements of the app for a secure password. These components encapsulate the functionality, but gives the developer the flexibility to layout the UI to their needs as demonstrated by the form field component.

So why are we talking about Ember, when this is a React article? When I first started in React, it was difficult to wrap my head around how I could encapsulate functionality while making my components flexible. There was the concept of higher order components, children passthrough and then ultimately I ended up with functions as children. This approach gives us the balance we need for flexibility while encapsulating concerns.

# **This isn’t new**

I just want to start out by saying that this isn’t a new concept, it’s been around for a while. In fact, [Merrick Christensen](https://medium.com/@iammerrick) wrote an article on [Function as Child Components](https://medium.com/merrickchristensen/function-as-child-components-5f3920a9ace9) that helped explain the concept clearly. I’m going to go through an example of how I’ve seen components put together. Then I’ll go into how making use of functions as components enables our code to be declarative and future proof.

# **Simple Components**

When I first came to React, it was super easy learning how to create components. They can be functional or stateful — it was really up to you and how you wanted to define them. So that’s where I started out, and life was great.

In fact, I put together this lovely pen for you to check out where we’re going to start:

%[https://codepen.io/alvincrespo/pen/oGQQMy] 

There’s not much going on here. But just to summarize:

* Actions and Field are functional components
    
* Form has been created as a stateful component (but it’s not using any state right now, so it could very well be a functional component)
    
* App is a functional component that instantiates the above components and lays them out in a simple manner
    
* And then we render everything into the #app element
    

This is how most people get started writing components — and it’s awesome!

Unfortunately, there is a problem. Most apps will have multiple forms, each utilizing common fields. Since username and password fields are common (e.g. adding a user, registering, login, etc…), it would be nice to be able to compose them for reuse elsewhere. So let’s get started on refactoring the above to make that so!

# **Simple Composable Components**

Ok, so we’re going to be reusing the email and password fields. This is simple; let’s just group those suckers up and get going. I’ve made another pen for you to show you the finished product:

%[https://codepen.io/alvincrespo/pen/VMqqBO] 

In the above pen, we’ve done the following:

* Created EmailField and PasswordField components, each are functional and just wrap their corresponding component/element instantiation
    
* Updated the App component to use EmailField and PasswordField
    

And that’s it! Wow, that was super easy. Now we can reuse our email and password fields — isn’t that great? Well, not so fast. We have now been informed that the layout for the “Add user” form is slightly different in that the label is below the input. Why? Well, because life is wonderful.

But don’t fret — we have functions as children!

# **Simple Functions as Children Component Composition**

At this point, usually you possibly have two options:

1. Go back to the team to decide on a design standard (heavily recommended)
    
2. Make your components flexible for your needs
    

We’re going to take option 2 for now, just so that we can see how to successfully setup our components to fit most of our needs.

%[https://codepen.io/alvincrespo/pen/vevbBE] 

The above pen is a bit complex, there are a quite a few changes with how we instantiate the EmailField and PasswordField. One being that we are now utilizing the functions as children approach to give us the flexibility to customize the components structure at the top level (e.g. consuming component or in this case App).

First, let’s look at how the EmailField and PasswordField are now structured.

```javascript
const PasswordField = (props) => {
  let children = {
    label: <label>Password</label>,
    input: <input type="password" />
  };
  
  if (props.children) {
    return props.children(children);
  }
  
  return (
    <Field>
      {children.label}
      {children.input}
    </Field>
  );  
};
```

The EmailField and PasswordField components are similar, so we’ll just look at how PasswordField is defined. In this case we’re creating a children object that will contain exposed properties that can be used in the instantiation of this component. We then check if children have been passed to the component (more on this later). If there are children, we pass that children object to the `props.children` call. Otherwise, if no children are passed, we have a default layout to present.

Ok, so now the key part to this is the instantiation bit.

```javascript
const App = () => {
  return (
    <PasswordField>
      {(props) => (
        <Field>
          {props.label}
          {props.input}
        </Field>
      )}
    </PasswordField>
  );
};
```

This code example is from the pen above, made simpler to just focus on the PasswordField component being created. In the code above we’re demonstrating two things:

1. Instantiating a component
    
2. Passing children to the component (in this case a function)
    
3. The passed function as a child declaring the properties exposed by the PasswordField component (label and input)
    

This may blow your mind, and to be honest I didn’t quite understand what was going on until I took a look at the source code:

```javascript
React.createElement(
  PasswordField,
  null,
  function (props) {
    return React.createElement(
      Field,
      null,
      props.label,
      props.input
    );
  }
);
```

Looking at the docs for [React.createElement](https://reactjs.org/docs/react-api.html#createelement) we can see that the children we’re passing to PasswordField is a function that is then called inside of PasswordField which creates the Field element and passes in `props.label` and `props.input` as it’s children, instead of a function.

If this is still confusing, don’t worry too much about it — it comes with time, I’ve been doing this for more than a year now and have just started wrapping my head around these functional programming aspects in JavaScript.

The concepts that we should take away from this are:

1. We can pass functions as children to components
    
2. These function can then render out properties we pass to that function from within the component definition
    

Why would we want to complicate our lives this way? Good question— it’s definitely complicated and there is a learning curve. Perhaps another example can help showcase how this methodology gives us the flexibility we need.

# **A Complex Yet Flexible and Elegant Solution**

Ok, so at this point we’ve showcased several ways to compose components in React. All have pros and cons to them. However, I would argue that functions as children gives us the necessary flexibility in our apps to be productive while flexible.

To prove this concept out, I’ve created the following pen.

%[https://codepen.io/alvincrespo/pen/aLXoBx] 

In the above example we implement several concepts we’ve learned throughout this article. We compose two forms in slightly different ways. Keep in mind that each strategy has it’s pros and cons, and neither is absolutely right.

The takeaway’s from the above example are these:

* You can compose nested components
    
* Returned components can be instantiated (e.g. `props.email` and `props.password` )
    
* Properties can be passed to these instantiated instances as normal (e.g. `<props.email onValid={this.onValidEmail} />`
    

# **Summing it up**

The benefit of React is that it’s flexible. This flexibility can be seen in the above examples. These strategies are great, they give each team of devs the power to have the implementation that works best for them. Personally, the last example in this article gives me the ability to declare components in an explicit manner.

First, lets look at the traditional way of composing a form:

```javascript
import React, { Component } from 'react';
import Form from './Form';
import EmailField from './EmailField';

class App extends Component {
  onValidEmail = () => {}
  onInvalidEmail = () => {}
  
  render() {
    return(
      <Form>
        <EmailField onValidEmail={this.onValidEmail} onInvalidEmail={this.onInvalidEmail} />
      </Form>
    );  
  }
}
```

This is pretty simple to understand:

1. We’re creating a React component
    
2. The component wraps a Form
    
3. The Form contains an EmailField
    

The downsides to this approach is that it:

1. Doesn’t encapsulate available fields for you (e.g. you need to import EmailField and use it, which causes a sort of disjointed relation between components)
    
2. You’re fully responsible for importing components and declaring them
    
3. Flexibility is limited to the layout those components have pre-defined
    

Again, technically there isn’t anything wrong with this approach. In fact, it’s easy to understand and utilize for many applications. But it just doesn’t give you the power you need to future proof your application.

To really utilize the power React gives you, you can build out encapsulated components that are flexible in this manner:

```javascript
import React, { Component } from 'react';
import Form from './Form';

class App extends Component {
  onValidEmail = () => {}
  onInvalidEmail = () => {}
  
  render() {
    return (
      <Form>
        {(props) => (
          <props.email 
            onValid={this.onValidEmail} 
            onInvalid={this.onInvalidEmail}>
            {(props) => (
              <props.field>
                {props.label}
                {props.input}
              </props.field>
            )}
          </props.email>
        )}
      </Form>    
    );
  }
}
```

When we read this code, there are certain truths:

* We only need to import Form
    
* Form exposes an Email component
    
* The Email component takes some actions as properties (e.g. `onValidEmail` and `onInvalidEmail` )
    
* The Email component exposes a Field component
    
* The Field component exposes a label and input
    

These truths centralize the functionality to the Form component. By following this pattern we can centralize form functionality common to our app to Form. This gives the dev team the ability to ensure a common language is shared and that we can stick to single source of truth.

Composing components is a central aspect to frontend architectural design. It gives you the freedom to do what you need when you need it. There is no right or wrong answer, but there are strategies that help strike an even balance between encapsulating functionality and flexibility.