---
title: Disabling .env files for Github Copilot
date: "2024-09-28T11:04:34.989Z"
description: "I was curious if there was a way to configure Github copilot to NOT have access to certain files in a project and found that - it’s not necessarily straightforward. It turns out that there are no dotfiles you can set up or a setting to explicitly tel..."
tags:
---

I was curious if there was a way to configure Github copilot to NOT have access to certain files in a project and found that - it’s not necessarily straightforward. It turns out that there are no dotfiles you can set up or a setting to explicitly tell copilot not to have access to certain files in your project, which seems problematic from a security perspective. However, there is a way to “disable” Github copilot by setting the language mode to “plaintext” in VSCode.

---

# Configuring Language Mode

There are three ways to configure the language mode.

## File in focus (shortcuts)

With the env var file open and in focus, do the following

1. Open the Command Palette by pressing `Cmd+Shift+P`.
    
2. Type `Change Language Mode` and select it.
    
3. In the language mode dropdown, type `plaintext` and select it.
    

![Open the Command Pallete](https://cdn.hashnode.com/res/hashnode/image/upload/v1727519307422/2f7b2f36-cace-44fd-b66f-a88f62a68ab5.png)

![Change Language Model](https://cdn.hashnode.com/res/hashnode/image/upload/v1727519314375/055a8e05-bfe4-4355-a629-edb66b1d0a81.png)

![Verify Plaintext is selected](https://cdn.hashnode.com/res/hashnode/image/upload/v1727519318382/adca8f06-6d01-447e-b482-b99ec0900519.png)

## File in focus (gui)

With the env var file open and in focus, do the following

1. At the bottom right of the status bar, click on the language mode selector.
    
2. Select `Configure File Association for ‘.env’`
    
3. Type `plaintext` and select it.
    

![Click on Language Mode Selector at the bottom right](https://cdn.hashnode.com/res/hashnode/image/upload/v1727519546693/7f89d085-e3d4-426e-96cc-9274f76e68ac.png)

![Select Configure File Association for '.env'](https://cdn.hashnode.com/res/hashnode/image/upload/v1727519555216/d50d2366-2f74-41db-a781-68e4d5053f86.png)

![Type plaintext and select it](https://cdn.hashnode.com/res/hashnode/image/upload/v1727519558544/6c0a5966-49fc-4937-87b5-f211d8feab3b.png)

## User Settings (JSON)

1. Open the Command Palette by pressing `Cmd+Shift+P`.
    
2. Type `open user settings` and select it.
    
3. With the settings.json file open, add the following:
    

```ruby
"files.associations": {
    ".env": "plaintext"
}
```

![Open Command Palette and type "open user settings"](https://cdn.hashnode.com/res/hashnode/image/upload/v1727520335193/42e46d90-6c72-4a4a-b44a-48bb745a90c5.png)

## User Settings (UI)

1. Open the Command Palette by pressing `Cmd+Shift+,`.
    
2. Search `associations`
    
3. Add `.env` as an item and set it to `plaintext`
    

![Adding .env to settings in UI](https://cdn.hashnode.com/res/hashnode/image/upload/v1727520525150/c77c0806-0666-4bb6-adb1-953806f07957.png)

### Bonus: Wildcard env var files

Setting `.env` as the file association to your settings will explicitely tell Github Copilot to disable itself for the `.env` file, however it will NOT disable itself for other file like `.env.local` or `.env.development`. So it’s a best practice to add a wildcard AFTER the `v` like so:

```ruby
"files.associations": {
    ".env*": "plaintext"
}
```

---

# Conclusion

There is no way to explicitly tell Github Copilot to ignore certain files. That is, unless, you have a Github Copilot Business account - which then [affords you this ability](https://github.com/orgs/community/discussions/11254#discussioncomment-8638961). With the above technique, there are some considerations per Github’s documentation:

> * In Copilot Chat in Visual Studio Code and Visual Studio, content exclusions are not applied when you use the `@github` chat participant in your question.
>     
> * It's possible that Copilot may use semantic information from an excluded file if the information is provided by the IDE in a non-excluded file. Examples of such content include type information and hover-over definitions for symbols used in code.
>     
> * [Excluding content from Github Copilot - Limitations of content exclusions](https://docs.github.com/en/copilot/managing-copilot/managing-github-copilot-in-your-organization/setting-policies-for-copilot-in-your-organization/excluding-content-from-github-copilot#limitations)
>     

---

# References

[https://stackoverflow.com/questions/77780462/how-to-exclude-specific-files-like-env-from-github-copilot-in-vs-code](https://stackoverflow.com/questions/77780462/how-to-exclude-specific-files-like-env-from-github-copilot-in-vs-code)

[https://docs.github.com/en/copilot/managing-copilot/managing-github-copilot-in-your-organization/setting-policies-for-copilot-in-your-organization/excluding-content-from-github-copilot#limitations](https://docs.github.com/en/copilot/managing-copilot/managing-github-copilot-in-your-organization/setting-policies-for-copilot-in-your-organization/excluding-content-from-github-copilot#limitations)

[https://github.com/orgs/community/discussions/11254#discussioncomment-8638961](https://github.com/orgs/community/discussions/11254#discussioncomment-8638961)

[https://github.com/orgs/community/discussions/13334](https://github.com/orgs/community/discussions/13334)