# 个人博客初版

这是一个零依赖静态博客。直接打开 `index.html` 就能预览，也可以上传到 GitHub Pages。

## 修改成你自己的博客

1. 在 `index.html` 中替换博客名、作者介绍、邮箱和 GitHub 链接。
2. 在 `main.js` 的 `posts` 数组中替换示例文章。
3. 在 `feed.xml` 中同步替换 RSS 标题、链接和文章摘要。
4. 如果你有自己的域名，在 GitHub Pages 设置里绑定域名。

## 本地预览

双击 `index.html` 即可打开。

## 发布到 GitHub Pages

推荐新建一个仓库，例如 `personal-blog`，然后把本目录中的文件提交上去。

```powershell
git init
git add .
git commit -m "Create personal blog"
git branch -M main
git remote add origin https://github.com/nwafuSKD/personal-blog.git
git push -u origin main
```

推送后，在 GitHub 仓库里进入 `Settings` -> `Pages`，选择从 `main` 分支的根目录发布。

如果你想使用 `https://nwafuSKD.github.io/` 这种主页地址，仓库名应改成 `nwafuSKD.github.io`。
