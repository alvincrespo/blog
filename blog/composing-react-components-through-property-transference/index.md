---
title: Composing React components through property transference
date: "2017-02-09T17:00:00.000Z"
description: "This article was originally published for Echobind here https://medium.com/theechobind/composing-react-components-through-property-transference-d8bc2dbecef5  Recently I’ve been working in React, creating a component library that enable developers to ..."
tags:
---

---

This article was originally published for Echobind here [https://medium.com/theechobind/composing-react-components-through-property-transference-d8bc2dbecef5](https://medium.com/theechobind/composing-react-components-through-property-transference-d8bc2dbecef5)

---

Recently I’ve been working in React, creating a component library that enable developers to compose their interface. There are many examples out there on how to create a composable component, but none of them really addressed my number one concern: easy setup and use. So in this article I’m going to talk about how I achieved that and how I enabled developers to take advantage of multiple components without worrying too much about their internal responsibilities.

## **The ideal solution**

When I’m building something for someone else, my first thought is “How can I make this easy for them to put together?” So I draft up what I think would be a good solution, planning out how the components should be laid out.

For the purpose of this article, I’m going to create a video game manager. The manager will list out video games, have the ability to add games to that list. With this in mind, my plan is to compose components in this way:

```javascript
<VideoGames>
  <VideoGameList />
  <VideoGameControls>
    <input type="text" />
    <button>Add</button>
  </VideoGameControls>
</VideoGames>
```

If this were a component library, a consumer should have the ability to customize it. For example, I should be able to move my `VideoGameControls` above `VideoGameList` with little to no problem. At this point, I’m not really concerned about hooking up the plumbing - this is my ideal state, so I’m going to shoot for this.

## **Throwing a wrench in the plans (third party JS)**

Now to throw a wrench into our plans, let’s say we’re integrating with a service. There is a third party provider that gives us the ability to manage our videogames, and our responsibility is to use this application within our components. This is a typical scenario when your team is responsible for integrating with a third party service. Let say the script they provide us looks a little something like this:

```javascript
window.VG = function() {
  return {
    _games: [],

    // ...
    // Some functions go here
    // ...

    on: function(evt, cb) {
      // This function will attach an event handler
    }

    games: function() {
      return this._games;
    }
  };
}
```

Ok great, so now we have a global object. Yay! Well, we don’t want to refer to a global object throughout our components, and really don’t need to. We can create an instance at the top most parent component in this manner:

```javascript
import React, { Component } from 'react';

class VideoGames extends Component {
  constructor() {
    super(props);

    this.state = { games: [] };
  }

  componentWillMount() {
    // Creates the instance of VG
    this.vg = new window.VG();

    // Listen to see when a game is added, if so, update the state of the component
    vg.on('added', () => {
      let { state } = this;

      state = Object.assign(state, { games: this.vg.games() });

      this.setState(state);
    });
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

export default VideoGames;
```

## **Tell your children (transferring props)**

So we got our ideal component structure up and we’re working with some third party JavaScript. But how do I tell VideoGameList to display a list of games if the instance of VG is on the VideoGames component?

![](https://miro.medium.com/v2/resize:fit:500/0*0jfG-PpRdxwFiVmy.gif)

To be honest I was pretty confused at this point. Coming from Ember, I was used to [contextual components](https://guides.emberjs.com/v2.11.0/components/block-params/) and it didn’t seem straight forward to me how to do this in React. After some digging around, I came across three utilities:

[React.Children.map](https://facebook.github.io/react/docs/react-api.html#react.children)

[React.isValidElement](https://facebook.github.io/react/docs/react-api.html#isvalidelement)

[React.cloneElement](https://facebook.github.io/react/docs/react-api.html#cloneelement)

So I used these methods to parse out the children and pass down properties to them that I wanted to expose in the render method of the VideoGames component, as so:

```javascript
// VideoGames.js

class VideoGames extends Component {
  render() {
    let { games } = this.state;
    let clonedChildren = React.Children.map(this.props.children, (child) => {
      let isReactElement = React.isValidElement(child);

      if (isReactElement) {
        return React.cloneElement(child, { games });
      }

      return child;
    });

    return (
      <div>
        {clonedChildren}
      </div>
    );
  }
}
```

The above loops through all the children the component is supposed to render, ensures they are valid React elements and if they are, they are cloned and the clone element receives the props passed in.

So at this point, `VideoGameList` and `VideoGameControls` are receiving the game property. The `VideoGameList` component can now render each game, and the `VideoGameControls` component can now execute actions against each game.

## **The Finish Line**

Ultimately composability in React is done through functions. Each component is a function that takes in some arguments. Through JSX we have the opportunity to dynamically compose the look and feel of a component, however it is limited. So we take advantage of some React utilities to clone children and apply the props we want, helping the developer move quickly when creating their interface.

The complete code for this article is located [here](https://github.com/alvincrespo/videogame-manager). Feel free to check it out and submit any feedback you might have. Thanks for reading and catch you soon!

## **References**

[Composable React Components](http://mintuz.com/2016/05/19/composable-react-components/)

[Composition vs Inheritance](https://facebook.github.io/react/docs/composition-vs-inheritance.html)

[React Composability Patterns](http://www.zhubert.com/blog/2016/02/05/react-composability-patterns/)

[React Top-Level API](https://facebook.github.io/react/docs/react-api.html)