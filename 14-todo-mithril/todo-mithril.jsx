/* @jsx m */

// 基底コンポーネント
class BaseComponent { }

// 基底モデル
class BaseModel {
	static type = 'Base';
	static modelClasses = {};
	// モデル化
	static toModel(model) {
		const Model = this.modelClasses[model.type];
		if (Model) return new Model(model);
		throw new TypeError('type "' + model.type + '" unknown');
	}
	// モデル・クラスの追加
	static addModel() {
		if (this.type === BaseModel.type)
			throw new TypeError('Model must have static "type" property');
		this.modelClasses[this.type] = this;
	}
	// JSON化
	toJSON() {
		return Object.assign({ type: this.constructor.type }, this);
	}
}

// モデル: TaskModel
class TaskModel extends BaseModel {
	static type = 'Task';
	// コンストラクタ
	constructor({ title, done }) {
		super();
		this.title = title || 'no title';
		this.done = done ? true : false;
		this.key = Date.now() + Math.random();
	}
}
TaskModel.addModel();

// コンポーネント: TaskApp
const TaskApp = {
	// コンストラクタ
	oninit(vnode) {
		// this === vnode.state
		this.tasks = [
			new TaskModel({ title: 'タスク1' }),
			new TaskModel({ title: 'タスク2', done: true }),
			BaseModel.toModel({ type: 'Task', title: 'タスク3' }),
			BaseModel.toModel({ type: 'Task', title: 'タスク4', done: true }),
		];
		// タスクの追加
		this.onAddTask = (title) =>
			this.tasks.push(new TaskModel({ title }));
		// 完了タスクを削除
		this.onRemoveCompleteTasks = () =>
			this.tasks = this.tasks.filter(task => !task.done);
		// デバッグをトグル
		this.onToggleDebug = () =>
			debugFlag = !debugFlag;
	},
	// レンダー
	view(vnode) {
		const { tasks } = this;
		return <div>
			<b onclick={this.onToggleDebug}>Todo App</b>
			<TaskFormArea onAddTask={this.onAddTask} />
			<TaskViewArea tasks={tasks} />
			<button onclick={this.onRemoveCompleteTasks}>完了タスクを削除</button>
			{debugFlag && <pre style={{ backgroundColor: 'lightgray' }}>{JSON.stringify(tasks, null, '  ')}</pre>}
		</div>;
	},
};


// コンポーネント: TaskFormArea
const TaskFormArea = {
	// コンストラクタ
	oninit(vnode) {
		// this === vnode.state
		this.title = '';
		// タイトルでキー入力
		this.onKeyDownTitle = (e) =>
			e.keyCode === 13 && this.onAddTask();
		// タイトル入力
		this.onChangeTitle = (e) =>
			this.title = e.target.value;
		// タスクの追加
		this.onAddTask = () => {
			if (this.title)
				(vnode.attrs.onAddTask)(this.title);
			this.title = '';
		};
	},
	// レンダー
	view(vnode) {
		// const { onChange } = vnode.attrs;
		return <div>
			タスク: <input value={this.title}
				oninput={this.onChangeTitle}
				onkeydown={this.onKeyDownTitle} />
			<button type="button" onclick={this.onAddTask}>追加</button>
		</div>;
	},
};

// コンポーネント: TaskViewArea
const TaskViewArea = {
	// レンダー
	view(vnode) {
		const { tasks } = vnode.attrs;
		return <ul> {tasks.map(task =>
			// keyを指定しないとコンポーネントとDOMの不一致が起こる可能性がある
			<TaskViewEntry key={task.key} task={task} />)} </ul>;
	},
};

// コンポーネント: TaskViewEntry
const TaskViewEntry = {
	// コンストラクタ
	oninit(vnode) {
		const { task } = vnode.attrs;
		// 終了フラグをトグル
		this.onToggleDone = () =>
			task.done = !task.done;
	},
	// レンダー
	view(vnode) {
		const { task } = vnode.attrs;
		const style = {
			color: task.done ? 'lightgray' : 'black',
			textDecoration: task.done ? 'line-through' : 'none'
		};
		return <li style={style} onclick={this.onToggleDone} >
			<input type="checkbox" checked={task.done} />
			{task.title}
		</li>;
	},
};

// デバッグフラグは、全体から見えるところに置く
let debugFlag = false;

// レンダー
// m.render(taskApp, <TaskApp />);
m.mount(taskApp, TaskApp);

/*
let count = 0; // 変数を追加
const Hello = { view() {
	return <div>
		<h1 className="title">最初のMithrilアプリケーション</h1>
		<button onclick={() => count++}>{count} クリック</button>
	</div>;
} };

m.mount(taskApp, Hello);
*/
