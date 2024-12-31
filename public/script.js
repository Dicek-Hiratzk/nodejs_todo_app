// index.htmlから要素の取得
const tasksDOM = document.querySelector(".tasks");
const formDOM = document.querySelector(".task-form");
const taskInputDOM = document.querySelector(".task-input");
const formAlertDOM = document.querySelector(".form-alert");

// ※axiosでエンドポイントにアクセスする(基本的にnode.jsとのやり取りは非同期処理)
// /api/v1/tasksからタスクを読み込む
const showTasks = async () => {
  try {
    // 自作のAPIを叩く(data属性だけ抜く)
    const { data: tasks } = await axios.get("/api/v1/tasks");
    // console.log(tasks);

    // タスクが1つもないとき
    // console.log(tasks.length);
    if (tasks.length < 1) {
      tasksDOM.innerHTML = `<h5 class="empty-list">タスクがありません</h5>`
      return;
    };

    // タスクを出力(mapで１つ１つタスクを取り出す)
    const allTasks = tasks.map((task) => {
      const { _id, name, completed } = task; // 分割代入で項目ごとのデータを取り出す

      return `<div class="single-task ${completed && "task-completed"}">
        <h5>
          <span><i class="far fa-check-circle"></i></span>${name}
        </h5>
        <div class="task-links">
          <!-- 編集リンク -->
          <a href="edit.html?id=${_id}" class="edit-link">
            <i class="fas fa-edit"></i>
          </a>
          <!-- ゴミ箱リンク -->
          <button type="button" class="delete-btn" data-id="${_id}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>`;
    })
    .join(""); // カンマ(データの区切り)削除
    // console.log(allTasks);
    tasksDOM.innerHTML = allTasks;
  } catch (err) {
    console.log(err);
  }
};

showTasks();

// タスクを新規作成する
formDOM.addEventListener("submit", async (event) => {
  // 再レンダリング防止
  event.preventDefault();

  const name = taskInputDOM.value;

  try {
    // name:はmodelsのTask.js内で指定している属性(データスキーマの構造の名前)
    await axios.post("/api/v1/tasks", { name: name });  // データ作成
    showTasks(); // データ反映
    taskInputDOM.value = ""; // 送信後の入力欄を空にするため
    formAlertDOM.style.display = "block"; // none状態から文言表示するため
    formAlertDOM.textContent = "タスクを追加しました。"; // 文言の内容
    formAlertDOM.classList.add("text-success"); // 新しいクラス付与(文字色変更のため)
  } catch (err) {
    console.log(err);
    formAlertDOM.style.display = "block"; // none状態から文言表示するため
    formAlertDOM.innerHTML = "無効です。もう一度やり直してください。"; // エラー文
  }
  // エラー文などを3秒後に消す
  setTimeout(() => {
    formAlertDOM.style.display = "none";
    formAlertDOM.classList.remove("text-success"); // クラス付与を解除(文字色変更のため)
  }, 3000);
});

// タスクを削除する
tasksDOM.addEventListener("click", async(event) => {
  const element = event.target;
  // console.log(element.parentElement); // parentElementは親要素
  if(element.parentElement.classList.contains("delete-btn")){
    const id = element.parentElement.dataset.id;
    // console.log(id);
    try {
      await axios.delete(`/api/v1/tasks/${id}`);
      showTasks(); // データ反映
    } catch (err) {
      console.log(err);
    }
  }
});