---
title: How Test Coverage impacts Annual Recurring Revenue (ARR)
date: "2024-12-02T10:25:53.111Z"
description: "Over a 25-year life expectancy of a large software system, almost fifty cents out of every dollar will go to finding and fixing bugs. UNDERSTANDING, FINDING AND FIXING DEFICIENCIES. Herb K. The Cost of Poor Software Quality in the US: A 2022 Report. ..."
tags:
---

> Over a 25-year life expectancy of a large software system, almost fifty cents out of every dollar will go to finding and fixing bugs.
> 
> UNDERSTANDING, FINDING AND FIXING DEFICIENCIES. Herb K. The Cost of Poor Software Quality in the US: A 2022 Report. [Link](https://www.it-cisq.org/wp-content/uploads/sites/6/2022/11/CPSQ-Report-Nov-22-2.pdf).

# Introduction

It’s always been challenging to connect engineering metrics to business outcomes for me. After reading Iccha Sethi’s latest post, [Tying Engineering Metrics to Business Metrics](https://icchasethi.medium.com/tying-engineering-metrics-to-business-metrics-f4df7651e026), I decided to dig into these engineering metrics further, starting with test coverage. We all know that test coverage is important, we want our changes to have a positive impact on our customer - not the other way around. In this article, I attempt to explain the important relationship that exists between test coverage and [Annual Recurring Revenue](https://www.wallstreetprep.com/knowledge/annual-recurring-revenue-arr/) (ARR).

---

# Test Coverage

Test coverage encompasses the extent to which a codebase is automatically tested. This is a common technical measure that affects a number of upstream goals, but it mainly works in two ways: lowering support tickets and speeding up the release of new features. Let’s look at how that works in practice, beginning with quality assurance.

## Quality Assurance

There are various types of test that cover different aspects of the code being committed, the most common types of tests include:

* *Automated verification* of functionality that ensures consistent behavior across code changes, preventing regression-related support tickets.
    
* *Regression testing* that catches unintended side effects when modifying existing features, maintaining feature velocity during updates.
    
* and finally, *Edge case detection,* which helps identify corner cases that might otherwise surface as customer-reported issues.
    

## Testing Strategies

There is no single right approach to testing, so having a multi-faceted strategy is important. Different types of tests and the requirements of those tests may be best suited for one strategy over another. Most teams have the following set of strategies:

**Automated Testing Pipeline**

Implementation of comprehensive automated testing suites that include unit tests, integration tests, and end-to-end tests running on every code change. This ensures continuous validation of functionality throughout the development lifecycle while enabling rapid feature deployment.

**Dedicated QA Team with Manual Testing**

A specialized team of people who perform systematic manual testing, exploratory testing, and user acceptance testing (UAT). They focus on user experience, edge cases, and real-world usage scenarios that might be difficult to automate, preventing future support tickets.

**Staged Deployments**

This strategy implements multiple environments (staging, alpha, beta, production) with a progressive testing plan for each stage. This typically includes canary releases and feature flag management to gradually roll out changes while monitoring for potential issues that could impact customer satisfaction.

## Primary Goals

Test coverage can only reduce support tickets and improve team velocity if it accomplishes two key objects; reducing risk and improving maintainability over time. Risk can never be truly eliminated with any strategy, so our goal here is to minimize it. Maintenance starts day one, any code written - is already in maintenance mode. Let’s look at some key research about these two topics real quick.

### **Reduce Risk**

Test coverage significantly reduces various risks that directly impact support ticket volume and feature velocity:

**Production Incidents**

Well-tested code dramatically reduces the likelihood of critical bugs making it to production, protecting against service disruptions that could impact customer satisfaction and retention. As noted in industry research:

> In 2022, [CISQ](https://www.it-cisq.org/the-cost-of-poor-quality-software-in-the-us-a-2022-report/) reported that poor software quality costs the US $2.41 trillion, with **operational failures** amounting to **$1.81 trillion**.
> 
> *Software incidents - what do they really cost you. Kaushik T.* [*Link*](https://spike.sh/blog/software-incidents-what-they-really-cost-you/#:~:text=Cost%20of%20Software%20Incidents,for%20U.S.%20financial%20services%20firms)

**Financial Risk**

Early bug detection through comprehensive testing prevents costly fixes and support escalations:

> The costs associated with data loss and downtime can be staggering for a small business. According to Framingham, Mass.-based consulting firm IDC, 80% of small businesses have experienced downtime at some point in the past, with costs ranging from $82,200 to $256,000 for a single event. What does this mean for IT? Every minute counts in a data recovery scenario – to the tune of $137 to $427 per minute.
> 
> *Downtime costs small businesses up to $427 per minute. Mark B.* [*Link*](https://web.archive.org/web/20191111180818/https://www.carbonite.com/blog/article/2015/10/downtime-costs-small-businesses-up-to-$427-per-minute/)

**Reputation Risk**

Stable, reliable software builds trust with customers and protects the company's market reputation. This directly impacts ARR, as improving customer retention by just 5% could lead to profits of 25-95%. High test coverage helps maintain this stability while enabling rapid feature development.

**Security Risk**

Test coverage that includes security testing helps identify vulnerabilities before they can be exploited, protecting both the company and its customers. This is particularly crucial for products depending on open source software (OSS), where regular dependency updates require confident testing to maintain both security and feature velocity.

### **Maintainability**

Well-tested code is easier to refactor and extend, facilitating long-term maintenance. Changing requirements and sudden pivots are expected in software development and testing ensures that the engineering team can shift quickly when needed. When risks are minimized and confidence is high, the team can respond quickly to the changing needs of the business.

> Over a 25-year life expectancy of a large software system, almost fifty cents out of every dollar will go to finding and fixing bugs.
> 
> *Herb K. (2022). The Cost of Poor Software Quality in the US: A 2022 Report.* [*Link*](https://www.it-cisq.org/wp-content/uploads/sites/6/2022/11/CPSQ-Report-Nov-22-2.pdf)

High maintainability through test coverage enables teams to:

* Deploy changes with *greater confidence*, reducing time spent on support issues
    
* Implement new features more *rapidly* without fear of breaking existing functionality
    
* *Respond* quickly to market demands while maintaining system stability
    
* Refactor and modernize code without introducing new support tickets
    

This improved maintainability directly supports both reduced support ticket volume and increased feature velocity, creating a positive feedback loop that enhances ARR growth potential.

---

# Annual Recurring Revenue (ARR)

Annual Recurring Revenue (ARR) is a critical metric for SaaS businesses, representing the normalized annual value of subscription contracts or a multi-year contract. The relationship between test coverage and ARR flows through several interconnected pathways, primarily through its impact on support tickets and feature velocity.

## Support Tickets Impact on ARR

Support tickets are a leading indicator of customer satisfaction. If there are less bug-related support tickets, technical issues will have faster resolution times. In turn, this will lead to a stable product that has higher customer satisfaction.

When customers are confident in the product they're more likely to 1) renew their subscriptions, 2) expand their usage of the product and 3) recommend the product to others (reducing the customer acquisition costs).

Service Level Agreements (SLAs) are also directly tied to support tickets. SLAs include a contractual obligation to resolve issues and also include financial penalties:

* Missed response time SLAs can trigger penalty clauses, directly reducing ARR
    
* Repeated SLA breaches may activate contract termination clauses, leading to customer loss
    
* High ticket volumes can overwhelm support teams, causing cascading SLA failures across multiple customers
    

Maintaining high test coverage and reducing support tickets ensures companies can better meet their SLA commitments, avoiding these negative financial impacts and protecting their ARR.

## Feature Velocity's Connection to ARR

Feature velocity, the speed at which new features can be reliably delivered, directly influences a company's ability to meet evolving market demands, stay competitive, capture additional revenue and expand into adjacent market segments. A culture of testing, focused on a high test coverage goals, can accomplish the following:

1. Reducing regression bugs that slow down development
    
2. Enabling confident refactoring to support new features
    
3. Allowing parallel development streams without quality degradation
    
4. Decreasing time spent on bug fixes vs. new development
    

Teams that can ship features quickly and confidently tend to support their companies ARR growth. If you can get valuable features to market faster, you're giving yourself a real edge. Faster time-to-market features that generate increases customer satisfaction as the product is innovating and continuously providing value.

## Quantifying the ARR Impact

In the context of this article, test coverage ensures that systematically reduce support tickets while improving feature velocity. If we achieve these goals, the combined effect will have a substantial positive impact on ARR. This is accomplished with direct cost savings and shifting resources to revenue growth opportunities.

### **Direct Cost Savings**

When support tickets are reduced, support costs are lowered. The support team can focus on other valuable areas that improve the customer experience. Engineering costs are also significantly reduced as less time is spend on bug fixes. A support team that elevates the customer experience + an engineering team that is laser focused on revenue growth opportunities equates to decreased customer churn-related revenue loss as the product will continuously push more valuable experiences.

### **Revenue Growth Opportunities**

An engineering team focused on revenue-generating features leads to higher customer satisfaction rates as usage of the application continues to expand. This places the company in a very competitive position in the market as it continues to deliver value while maintaining existing critical systems. Happy customers will improve referral rates and customer acquisition costs should go down.

This creates a positive feedback loop - better quality leads to happier customers, which drives growth, which lets you invest more in quality.

### **An Example**

**Assumption:** We have decided to focus exclusively on test coverage and two new features. We want support tickets to decrease so our support team can focus on working closely with customers to improve our customer experience. We also want our team velocity to improve by building trust in the existing systems so we can expand on them.

**Goal**:

20-35% Lower Customer Churn Rates

**Base:** 1000 customers \* $1000/year = $1,000,000 base ARR

**Strategy:**

* Fewer frustrating bugs that might cause customers to leave
    
* Faster resolution of issues when they do occur
    

**Breakdown:**

If a company has a 15% annual churn rate:

* 15% churn = 150 customers lost = $150,000 lost
    
* 25% reduction in churn = new churn of 11.25% (15% \* 0.75)
    
* New customers lost: 1000 x 11.25% = 113 customers
    
* New loss: 113 \* 1000 = $113,000
    
* Savings: $150,000 - $113,000 = $37,000
    

**Goal:**

15-25% Higher Expansion Revenue

**Strategy:**

* Customers trust the product more due to reliability
    
* Sales teams can focus on upselling rather than handling complaints
    
* Customers are more likely to adopt new features when core functionality is stable
    

**Breakdown:**

If average customer expansion is $200/year across 1000 customers:

* Current expansion: 1000 \* $200 = $200,000
    
* 20% improvement: $200,000 \* 1.2 = $240,000
    
* Additional ARR: $240,000 - $200,000 = $40,000
    

**Goal:**

10-20% Improvement in New Customer Acquisition through Referrals

**Strategy:**

* They see regular feature improvements
    
* Word-of-mouth about product reliability spreads
    

**Breakdown:**

If 20% of new customers (100/year) come from referrals at $1000/year each:

* Current referral revenue: 100 \* $1,000 = $100,000
    
* With 15% improvement: 115 \* $1,000 = $115,000
    
* Additional ARR: $115,000 - $100,000 = $15,000
    

**Combined Impact:**

If base ARR is $1,000,000:

* Reduced churn: +$37,000
    
* Increased expansion: +$40,000
    
* More referrals: +$15,000
    
* Total ARR impact: +$92,000 (9.2% improvement)
    

These numbers are particularly powerful because they compound over time:

* Year 1: $92,000 additional ARR
    
* Year 2: Previous $92,000 + new improvements
    
* Year 3+: Continued compounding effect
    

---

# Conclusion

Explaining why test coverage matters to folks outside of engineering can be tricky. But when you break down how it impacts the business, the story becomes pretty clear: better test coverage means you can ship features faster and more reliably, which keeps customers happy and helps grow your revenue.

When your team can confidently push code to production and your services stay stable, you're not just making engineers' lives easier. You're building trust with your customers, keeping them around longer, and making them more likely to recommend your product to others. This is especially crucial if you're running a subscription-based business where every churned customer directly hits your bottom line.

I hope this breakdown helps you make a stronger case for investing in test coverage. Whether you're talking to your product team, executives, or other stakeholders, you now have concrete examples of how technical quality translates to business success. Feel free to use these examples and references in your next conversation about why test coverage deserves attention and resources.

In the meantime, let me know what you think. You can catch me on [Bluesky](https://bsky.app/profile/alvincrespo.bsky.social) or reach out via this [Google Form](https://docs.google.com/forms/d/e/1FAIpQLSd3FJbsjj8kqY3HF2HixnwsNQ2VyQYQNomasGQBIq0r6FAMJQ/viewform). Have a great day!

---

# References

1. Sethi, I. (2020). *Tying Engineering Metrics to Business Metrics*. Medium. [Link](https://icchasethi.medium.com/tying-engineering-metrics-to-business-metrics-f4df7651e026)
    
2. Humble, J., & Farley, D. (2010). *Continuous Delivery: Reliable Software Releases through Build, Test, and Deployment Automation*. Addison-Wesley.
    
3. [Jones,](https://bsky.app/profile/alvincrespo.bsky.social) C. (2017). *Software Quality*[*: Analysis*](https://docs.google.com/forms/d/e/1FAIpQLSd3FJbsjj8kqY3HF2HixnwsNQ2VyQYQNomasGQBIq0r6FAMJQ/viewform) *and Guidelines for Success*. McGraw-Hill Education.
    
4. Consortium for IT Software Quality (CISQ). (2020). *The Cost of Poor Software Quality in the US: A 2020 Report*. [Link](https://www.it-cisq.org/the-cost-of-poor-software-quality-in-the-us-a-2020-report/)
    
5. Federico, T. (2019). *Why Software Testing is Necessary for Delivering Superior Customer Experiences.* DZone\*.\* [Link](https://web.archive.org/web/20191203131404/https://dzone.com/articles/why-software-testing-is-necessary-for-delivering-s)
    
6. Boehm, B., & Basili, V. R. (2001). Software defect reduction top 10 lis[t. *IEEE*](https://bsky.app/profile/alvincrespo.bsky.social) *Computer*, 34(1), 135-137. [doi:10.1109](https://docs.google.com/forms/d/e/1FAIpQLSd3FJbsjj8kqY3HF2HixnwsNQ2VyQYQNomasGQBIq0r6FAMJQ/viewform)[/2.962984](https://doi.org/10.1109/2.962984)
    
7. *UNDERSTANDING, FINDING AND FIXING DEFICIENCIES. Herb K. The Cost of Poor Software Quality in the US: A 2022 Report.* [*Link*](https://www.it-cisq.org/wp-content/uploads/sites/6/2022/11/CPSQ-Report-Nov-22-2.pdf)*.*
    
8. Marius. K. (2021). *Customer Acquisition vs. Customer Retention: What Data Says?.* [Link](https://www.markinblog.com/customer-loyalty-retention-statistics/)
    
9. Kaushik T. (2024). Software incidents - what do they really cost you. [Link](https://spike.sh/blog/software-incidents-what-they-really-cost-you/#:~:text=Cost%20of%20Software%20Incidents,for%20U.S.%20financial%20services%20firms)
    
10. Mark B. (2018). Downtime costs smal[l busin](https://bsky.app/profile/alvincrespo.bsky.social)esses up to $427 per minute[. Link](https://docs.google.com/forms/d/e/1FAIpQLSd3FJbsjj8kqY3HF2HixnwsNQ2VyQYQNomasGQBIq0r6FAMJQ/viewform)
    
11. [S](https://docs.google.com/forms/d/e/1FAIpQLSd3FJbsjj8kqY3HF2HixnwsNQ2VyQYQNomasGQBIq0r6FAMJQ/viewform)tep-by-Step Guide to Understanding Annual Recurring Revenue. [Link](https://www.wallstreetprep.com/knowledge/annual-recurring-revenue-arr/)