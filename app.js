const express = require("express");
const app = express();
const taskRoute = require("./routes/tasks");
const connectDB = require("./db/connect");
require("dotenv").config();

app.use(express.json()); // json形式を使えるようにする
app.use(express.static("./public")); // 静的なファイルを見にいく ※index.html

const PORT = 3000;

// ルーティング設計
app.use("/api/v1/tasks", taskRoute);

// データベースと接続 Cluster0 非同期処理
const start = async () => {
  try {
    await connectDB(process.env.MONGO_DEPLOY_URL || process.env.MONGO_URL); // 本番環境用の環境変数KEY || 開発環境用
    app.listen(process.env.PORT || PORT, console.log("サーバーが起動しました"));
  } catch (err) {
    console.log(err);
  }
};

start();