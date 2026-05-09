# 喵喵番茄钟

超萌猫咪宠物番茄时钟——将番茄工作法与虚拟宠物养成结合的桌面伴侣应用。

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 类型检查
npm run check

# 代码检查
npm run lint
```

## 构建与部署

### 构建

```bash
npm run build
```

构建产物输出到 `dist/` 目录，可直接部署到任意静态文件服务器。

### 本地预览构建产物

```bash
npm run preview
```

### 部署到 Vercel

1. 将代码推送到 GitHub 仓库
2. 在 [Vercel](https://vercel.com) 中导入该仓库
3. Framework Preset 选择 **Vite**，构建命令和输出目录保持默认即可
4. 点击 Deploy

或使用 Vercel CLI：

```bash
npm i -g vercel
vercel
```

### 部署到 Netlify

1. 将代码推送到 GitHub 仓库
2. 在 [Netlify](https://netlify.com) 中导入该仓库
3. 构建命令填写 `npm run build`，发布目录填写 `dist`
4. 点击 Deploy

或使用 Netlify CLI：

```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

### 部署到 GitHub Pages

1. 安装 `gh-pages`：

```bash
npm install --save-dev gh-pages
```

2. 在 `package.json` 中添加部署脚本：

```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

3. 如果项目不是部署在根路径，需在 `vite.config.ts` 中设置 `base`：

```ts
export default defineConfig({
  base: '/<仓库名>/',
})
```

4. 执行部署：

```bash
npm run deploy
```

### 部署到自建服务器

将 `dist/` 目录下的文件上传到服务器的 Web 根目录（如 Nginx 的 `/usr/share/nginx/html`）即可。

Nginx 配置示例（支持 SPA 路由）：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```
