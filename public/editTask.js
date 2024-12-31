// edit.htmlから要素の取得
const taskIDDOM = document.querySelector(".task-edit-id");
const taskNameDOM = document.querySelector(".task-edit-name");
const editFormDOM = document.querySelector(".single-task-form");
const formAlertDOM = document.querySelector(".form-alert");
const taskCompletedDOM = document.querySelector(".task-edit-completed");

const params = window.location.search; // URLのid持ってくる
// console.log(params);
const id = new URLSearchParams(params).get("id"); // ?id=を削除しidを取得する
console.log(id);

// 1つの特定のタスクを取得する
const showTask = async () => {
  try {
    const { data: task } = await axios.get(`/api/v1/tasks/${id}`);
    // console.log(task);
    const { _id, name, completed } = task; // task属性の3つを取り出す
    taskIDDOM .textContent = _id;
    taskNameDOM.value = name;
    if (completed) {
      taskCompletedDOM.checked = true; // 完了はチェックボックスにチェックありにする
    }
  } catch (err) {
    console.log(err);
  }
};

showTask();

// タスクの編集
editFormDOM.addEventListener("submit", async (e) => {
  e.preventDefault(); // 更新(再レンダリング)防止
  try {
    const taskName = taskNameDOM.value;
    taskCompleted = taskCompletedDOM.checked; // タスク完了のboolean
    const { data: task } = await axios.patch(`/api/v1/tasks/${id}`,{
      name: taskName,
      completed: taskCompleted,
    });
    formAlertDOM.style.display = "block";
    formAlertDOM.textContent = "編集に成功しました";
    formAlertDOM.classList.add("text-success"); // テキストの色を緑にするクラスの付与
  } catch (err) {
    console.log(err);
  }

  // 文言を3秒後に消す
  setTimeout(() => {
    formAlertDOM.style.display = "none";
    formAlertDOM.classList.remove("text-success"); // クラス付与を解除(文字色変更のため)
  }, 3000);
});