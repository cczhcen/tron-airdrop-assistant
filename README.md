# Tron Airdrop Assistant

## 目录

- [注册和部署到 Vercel](#注册和部署到-vercel)
- [MongoDB Atlas 注册及 DATABASE_URL 获取](#mongodb-atlas-注册及-database_url-获取)
- [使用说明](#使用说明)
- [贡献](#贡献)
- [许可证](#许可证)

## 注册和部署到 Vercel

1. **创建 Vercel 账户**：

   - 访问 [Vercel 官网](https://vercel.com)。
   - 点击 "Sign Up" 注册一个新账户，您可以使用 GitHub、GitLab 或电子邮件注册。

2. **导入项目**：

   - 登录后，点击 "New Project"。
   - 选择您的 GitHub/GitLab 仓库，Vercel 会自动检测到项目。

3. **配置环境变量**：

   - 在项目设置中，找到 "Environment Variables" 部分。
   - 添加 `DATABASE_URL` 变量，值为您的 MongoDB Atlas 连接字符串。
   - 添加 `NEXT_PUBLIC_TRONSCAN_URL` 变量，值为您的 TronLink 钱包 URL。
   - 添加 `NEXT_PUBLIC_AIRDROP_ADDRESS` 变量，值为您的空投合约地址。

4. **部署项目**：
   - 点击 "Deploy" 按钮，Vercel 会自动构建并部署您的项目。
   - 部署完成后，您将获得一个可访问的 URL。

## MongoDB Atlas 注册及 DATABASE_URL 获取

1. **创建 MongoDB Atlas 账户**：

   - 访问 [MongoDB Atlas 官网](https://www.mongodb.com/cloud/atlas)。
   - 点击 "Sign Up" 注册一个新账户。

2. **创建新项目**：

   - 登录后，点击 "Create a New Project"。
   - 输入项目名称并点击 "Next"。

3. **创建数据库集群**：

   - 选择 "Build a Cluster"。
   - 选择免费套餐（M0）并配置集群设置。
   - 点击 "Create Cluster"。

4. **获取连接字符串**：

   - 在集群页面，点击 "Connect"。
   - 选择 "Connect your application"。
   - 复制连接字符串，格式如下：
     ```
     mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>
     ```
   - 将 `<username>` 和 `<password>` 替换为您的数据库用户名和密码，`<dbname>` 替换为您要使用的数据库名称。

5. **设置网络访问**：
   - 在 "Network Access" 中，添加 IP 地址 0.0.0.0/0，以允许所有 IP 访问（仅用于开发，生产环境中请限制 IP）。

## 使用说明

1. 克隆项目：

   ```bash
   git clone https://github.com/yourusername/yourproject.git
   cd yourproject
   ```

2. 安装依赖：

   ```bash
   npm install
   ```

3. 运行开发服务器：
   ```bash
   npm run dev
   ```

## 贡献

欢迎任何形式的贡献！请提交问题或拉取请求。

## 许可证

本项目使用 MIT 许可证，详细信息请查看 [LICENSE](LICENSE) 文件。
