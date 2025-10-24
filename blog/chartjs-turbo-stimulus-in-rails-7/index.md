---
title: Chart.js + Turbo Stimulus in Rails 7
date: "2022-01-03T18:53:27.630Z"
description: "Background Over the winter break I updated our gardening app, Jardim.io, to Rails 7. It was a breeze! However, we were still reliant on webpack because we had a React application that utilized nivo for our charting solution. Webpack and React are ove..."
tags:
---

## Background

Over the winter break I updated our gardening app, Jardim.io, to Rails 7. It was a breeze! However, we were still reliant on [webpack](https://webpack.js.org/) because we had a [React](https://reactjs.org/) application that utilized [nivo](https://nivo.rocks/) for our charting solution.

Webpack and React are overly complex and difficult to maintain. We want our stack to be [lean and effective](https://www.youtube.com/watch?v=PtxZvFnL2i0), so we're migrating to [esbuild](https://github.com/evanw/esbuild).

So as part of this work, I needed to migrate to another solution. That's where [Chart.js](https://www.chartjs.org/) comes in!

Why Chart.js?

* Fits our needs (simplicity)
    
* Extensive [ecosystem](https://github.com/chartjs/awesome)
    
* Code is easy to read and contribute
    

---

## Dependencies

All we need to do is add `chart.js` as a dependency:

```bash
yarn add chart.js
```

If you're using NPM:

```bash
npm i chart.js
```

---

## The Data / Template / View

In our app, Jardim.io, we are taking "biometric" data of plants and representing them in the chart.

Yes, we can create an API endpoint, get some JSON via AJAX and do a bunch of fancy stuff. But, I'm not going to do that. It adds a ton of complexity I really don't care about. What complexity? Well, authorization is one. I don't care about this right now, we are creating a traditional monolith - so we already know who is requesting what.

So what do we do? Drop that data in the markup itself!

### Embedding Data

```erb
<div id="metrics" data-metrics="<%= @metrics.to_json %>"></div>
```

You can place this anywhere on your page. In fact, you may want to use [template](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template) instead. Either way, the idea is to embed the data on to the page, and let JS pick it up and use it. Eliminating indirection with an API call and creating more maintenance for yourself and your team.

NOTE: `@metrics` is an instance variable created in the controller's action.

### The Chart Element(s)

```erb
<div class="chart-container" data-controller="chart" data-metric="<%= metric %>" data-unit="<%= unit %>">
  <canvas id="YOUR_ELEMENT_ID" width="400" height="400"></canvas>
</div>
```

This is what will be used to instantiate and style the chart. This is done through `data-controller` and is an API to Turbo Stimulus, for more information check out the documenation [here](https://stimulus.hotwired.dev/reference/lifecycle-callbacks#targets).

That's it for the template/view. Let's start writing some JavaScript.

---

## The Stimulus Controller

Our chart will be instantiated by a "controller". If you're not familiar with Stimulus' controller class, read the docs [here](https://stimulus.hotwired.dev/reference/controllers).

```js
// app/packs/controllers/chart_controller.js
import { Controller } from "@hotwired/stimulus";
import Chart from 'chart.js/auto';

export default class ChartController extends Controller {
  static ELEMENT_ID = 'YOUR_ELEMENT_ID';
  static DEFAULT_OPTIONS = { responsive: true, maintainAspectRatio: false };

  connect() {
    this.render();
  }

  render() {
    // TODO
  }
}
```

This is the basic scaffold of our controller. A couple of things to note here:

* `ELEMENT_ID` is the id of your element, e.g. `<div id="YOUR_ELEMENT_ID">`
    
* `DEFAULT_OPTIONS` are the options to be passed to the instance of `Chart`. The options you see here allowed our chart to span the full width of it's container.
    
* `connect` is a Stimulus Controller specific API, read more about it [here](https://stimulus.hotwired.dev/reference/lifecycle-callbacks#connection).
    
* We are importing all of Chart.js, if you want to customize the imports, which you should, check out the docs [here](https://www.chartjs.org/docs/latest/getting-started/integration.html#bundlers-webpack-rollup-etc).
    

Alright, let's pseudo code:

```js
// app/packs/controllers/chart_controller.js
import { Controller } from "@hotwired/stimulus";
import Chart from 'chart.js/auto';

export default class ChartController extends Controller {
  static ELEMENT_ID = 'YOUR_ELEMENT_ID';
  static DEFAULT_OPTIONS = { responsive: true, maintainAspectRatio: false };

  connect() {
    this.render();
  }

  render() {
    // If the element exists, instantiate an instance
  }

  get ele() {
    // retrieve the canvas element
  }

  get metric() {
    // get the metric for the chart
  }

  get unit() {
    // get the unit for the chart
  }

  get metrics() {
    // get the metrics from the data embedded on the page
  }

  get options() {
    // get default options, maybe merge it?
  }

  get data() {
    // normalize the data for the chart
  }

  get labels() {
    // generate labels for the chart
  }

  get datasets() {
    // get the datasets to be represented in the chart
  }
}
```

These are all the methods we'll need.

### The `render` method

```js
  render() {
    if (!this.ele) return;

    const ctx = this.ele.getContext('2d');

    this.graph = new Chart(ctx, { type: 'line', data: this.data, options: this.options });
  }
```

The render method handles two scenarios. One, if the element doesn't exist then don't render a chart. If the element exists, let's render the chart.

### The `ele` getter function

```js
  get ele() {
    return this._ele = this._ele || document.getElementById(ChartController.ELEMENT_ID);
  }
```

This method, looks for the element with the id specified on the static class property `ELEMENT_ID`. This translates to:

```js
document.getElementById('YOUR_ELEMENT_ID');
```

NOTE: We are also memoizing, or caching, `ele` through the use of:

```js
this._ele = this._ele || document.getElementById('YOUR_ELEMENT_ID');
```

Basically, the above will evaluate to `document.getElementById('YOUR_ELEMENT_ID');` the first time. All subsequent calls will return `this._ele` because it was already called.

If thats confusing, it's ok. Caching is always confusing.

### The `metric` and `unit` getter functions

#### Context

Our application, in Jardim.io, allows measurements for a plant to be visualized. For example, a plants height, spread or number of flowers. The units for each can be different. For example, you might measure height in inches, centimeters, millimeters, etc...

So both `metric` and `unit` functions above are retrieving **what** we are representing.

```js
  get metric() {
    return this._metric = this._metric || this.element.dataset.metric;
  }

  get unit() {
    return this._unit = this._unit || this.element.dataset.unit;
  }
```

Both these functions will look for the `metric` and `unit` dataset on the element that the class is instantiated on, e.g. `data-controller`.

### The `metrics` getter function

```js
  get metrics() {
    return this._metrics = this._metrics || JSON.parse(document.querySelector('[data-metrics-type]').dataset.metrics);
  }
```

This is the actual core of our code for retrieving the embedded data. We are leveraging `document.querySelector('[data-metrics-type]')` to find the element and then we tap into the [dataset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset) API tot retrieve the JSON based metrics.

### The `options` getter function

```js
  get options() {
    return ChartController.DEFAULT_OPTIONS;
  }
```

These are the options that will be used for the instance of `Chart`. For now, we're getting static options, but you can leverage this to override these options based on parameters on the element for the controller. Wow, thats a mouthful!

If you're looking for what options you can customize, check out the docs [here](https://www.chartjs.org/docs/latest/configuration/).

### The `data` and `labels` getter functions

```js
  get data() {
    return { labels: this.labels, datasets: this.datasets };
  }

  get labels() {
    return this._labels = this._labels || this.metrics.map((m) => new Date(m.updated_at).toDateString());
  }
```

These two getters are generating the data and labels for the chart. Note that I'm currently looping through the metrics and generating a date timestamp for the x-axis here. I'll talk about improvements we can make to this code in a later section.

### The `dataset` getter function

```js
  get datasets() {
    return [{
      label: `${this.metric} / ${this.unit}`,
      data: this.metrics.map((m) => parseInt(m.value, 10)),
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }];
  }
```

This function generates the label, data and some configuration options for the chart. This is a Chart.js API, read more about it [here](https://www.chartjs.org/docs/latest/general/data-structures.html).

Ok, great! This is what our file looks like now:

```js
// app/packs/controllers/chart_controller.js
import { Controller } from "@hotwired/stimulus";
import Chart from 'chart.js/auto';

export default class ChartController extends Controller {
  static ELEMENT_ID = 'YOUR_ELEMENT_ID';
  static DEFAULT_OPTIONS = { responsive: true, maintainAspectRatio: false };

  connect() {
    this.render();
  }

  render() {
    if (!this.ele) return;

    const ctx = this.ele.getContext('2d');

    this.graph = new Chart(ctx, { type: 'line', data: this.data, options: this.options });
  }

  get ele() {
    return this._ele = this._ele || document.getElementById(ChartController.ELEMENT_ID);
  }

  get metric() {
    return this._metric = this._metric || this.element.dataset.metric;
  }

  get unit() {
    return this._unit = this._unit || this.element.dataset.unit;
  }

  get metrics() {
    return this._metrics = this._metrics || JSON.parse(document.querySelector('[data-metrics-type]').dataset.metrics);
  }

  get options() {
    return ChartController.DEFAULT_OPTIONS;
  }

  get data() {
    return { labels: this.labels, datasets: this.datasets };
  }

  get labels() {
    return this._labels = this._labels || this.metrics.map((m) => new Date(m.updated_at).toDateString());
  }

  get datasets() {
    return [{
      label: `${this.metric} / ${this.unit}`,
      data: this.metrics.map((m) => parseInt(m.value, 10)),
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }];
  }
}
```

---

## The Result + Retrospective

We now have a very simple and lightweight controller we can use to instantiate instances of Chart.js. With data embedded on the page, all we do is retrieve it, normalize it to json and pass it as a dataset to our Chart instance. Now, we just need to style it - which I'll leave up to you.

This is my first pass migrating to Chart.js and I picked up a few things I would love to do in our next iteration, this includes:

* Normalizing the data on the backend a bit more
    
    * Use date time formatting from Ruby/Rails (not JS)
        
    * Move metric and unit into the data itself (vs dataset)
        
* Allow for customization of options
    
* Investigate a common utility for memoizing
    
* Add error handling around null/undefined dataset or missing element
    

When I do get a chance to tackle some of these items, I'll make sure to follow up from this post.

---

## Overview

Chart.js is an excellent open source library that helps you visualize data. Rails 7, specifically Turbo/Stimulus, allows us to easily implement it into our application for a seamless experience, enabling our customers with a fast solution while lightening our technology stack is a major win.

Hope you enjoyed! If you love what you read, let me know at [@alvincrespo](https://twitter.com/alvincrespo)!

## References

* [https://www.chartjs.org/](Chart.js)
    
* [https://stimulus.hotwired.dev/handbook/origin](Stimulus)