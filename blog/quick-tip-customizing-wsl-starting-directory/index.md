---
title: Quick Tip - Customizing WSL Starting Directory
date: "2025-08-04T19:46:00.442Z"
description: If you’re using WSL like I am on Windows 11 - you most likely have run into the issue where launching WSL from the applications menu was starting you at /mnt/c/windows/system32:

If you need to customize this to work in your home directory, you can c...
tags:
---

If you’re using WSL like I am on Windows 11 - you most likely have run into the issue where launching WSL from the applications menu was starting you at `/mnt/c/windows/system32`:

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1754335924563/b038903b-140d-4cd8-b99b-590eb1d0db0f.png align="center")

If you need to customize this to work in your home directory, you can customize it in the properties of the application.

First, you need to open the file location - since this is a shortcut:

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1754336286775/cbf0d868-e728-4f54-8754-4967926621c1.png align="center")

Once there, right click and hit properties:

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1754336415223/4dd29f24-c8ad-4883-b0af-df81618b8143.png align="center")

Finally, in the “Start in” field, type in `~/`:

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1754336456794/baf3f4c5-440f-41c1-9903-08b4478b907c.png align="center")

Once you click apply, and you most likely will need to approve as an administrator, you can start a new WSL session and you’ll be in your home directory:

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1754336580952/a99f9545-4a9d-4c86-b5b4-c0d8e9339d46.png align="center")

🎉🎉🎉 You’re now starting in the default directory when launching WSL.

---

## References

WSL starting in /mnt/c/windows/system32

[https://superuser.com/questions/1732336/wsl-starting-in-mnt-c-windows-system32](https://superuser.com/questions/1732336/wsl-starting-in-mnt-c-windows-system32)