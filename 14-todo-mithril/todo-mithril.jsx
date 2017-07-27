// todo-mithril.jsx

/* @jsx m */

// 基底モデル
class BaseModel {
	static modelClasses = {};
	// モデル化
	static create(model) {
		const Model = this.modelClasses[model.type];
		if (Model) return new Model(model);
		throw new TypeError('type "' + model.type + '" unknown');
	}
	// モデル・クラスの追加
	static addModel() {
		if (!this.name || this.name === BaseModel.name)
			throw new TypeError('Model must have "name" property');
		this.modelClasses[this.name] = this;
	}
	// JSON化
	toJSON() {
		return Object.assign({ type: this.constructor.name }, this);
	}
}

// モデル: TaskModel
class TaskModel extends BaseModel {
	// コンストラクタ
	constructor({ title, done }) {
		super();
		this.title = title || 'no title';
		this.done = done ? true : false;
		this.key = Date.now() + Math.random();
	}
}
TaskModel.addModel();

const DISP_MODES = [
	{mode: 0, name: '全て', filter: task => true},
	{mode: 1, name: '未了', filter: task => !task.done},
	{mode: 2, name: '完了', filter: task => task.done},
];

// コンポーネント: TaskApp
const TaskApp = {
	// コンストラクタ
	oninit(vnode) {
		// thisはvnode.stateなので、自由にプロパティを使って良い (Mithril)
		this.tasks = [
			new TaskModel({ title: 'タスク1' }),
			new TaskModel({ title: 'タスク2', done: true }),
			BaseModel.create({ type: 'TaskModel', title: 'タスク3' }),
			BaseModel.create({ type: 'TaskModel', title: 'タスク4', done: true }),
		];
		this.dispMode = 0; // 0: 全て, 1: 未了, 2: 完了
		// タスクの追加
		this.onAddTask = title =>
			this.tasks.push(new TaskModel({ title }));
		// 完了タスクを削除
		this.onRemoveCompleteTasks = () =>
			this.tasks = this.tasks.filter(task => !task.done);
		// 全て完了/未了
		this.onRevertTasks = () => {
			const done = !this.tasks.every(task => task.done);
			this.tasks.forEach(task => task.done = done);
		};
		// デバッグをトグル
		this.onToggleDebug = () =>
			debugFlag = !debugFlag;
	},
	// レンダー
	view(vnode) {
		// thisはvnode.stateなので、自由にプロパティを使って良い (Mithril)
		const { tasks, dispMode } = this;
		return <div>
			<b onclick={this.onToggleDebug}>Todo App (Mithril)</b>
			<TaskFormArea
				onAddTask={this.onAddTask} />
			<hr/>
			<div>
				表示：
				{DISP_MODES.map(x =>
					<button type="button"
						onclick={() => this.dispMode = x.mode}
						>{dispMode === x.mode && '★'}{x.name}{tasks.filter(x.filter).length}</button>
				)}
			</div>
			<div>
				操作：
				<button type="button"
					disabled={!tasks.length}
					onclick={this.onRevertTasks}
					>全て完了/未了</button>
				<button type="button"
					disabled={tasks.every(task => !task.done)}
					onclick={this.onRemoveCompleteTasks}
					>完了タスクを削除</button>
			</div>
			<hr/>
			<TaskViewArea
				tasks={tasks.filter(DISP_MODES[dispMode].filter)} />
			{debugFlag && <pre style={{ backgroundColor: 'lightgray' }}>{JSON.stringify(tasks, null, '  ')}</pre>}
		</div>;
	},
};

// コンポーネント: TaskFormArea
const TaskFormArea = {
	// コンストラクタ
	oninit(vnode) {
		// thisはvnode.stateなので、自由にプロパティを使って良い (Mithril)
		this.title = '';
		// タイトルでキー入力
		this.onKeyDownTitle = e =>
			e.key === 'Enter' || e.keyCode === 13 ? this.onAddTask() : void 0;
		// タイトル入力
		this.onChangeTitle = e => this.title = e.target.value;
		// タスクの追加
		this.onAddTask = () => {
			this.title &&
			(vnode.attrs.onAddTask)(this.title);
			this.title = '';
		}
	},
	// レンダー
	view(vnode) {
		// thisはvnode.stateなので、自由にプロパティを使って良い (Mithril)
		const { title } = this;
		return <div>
			タスク: <input type="text" value={title}
				oninput={this.onChangeTitle}
				onkeydown={this.onKeyDownTitle} />
			<button type="button"
				disabled={!title}
				onclick={this.onAddTask}
				>追加</button>
		</div>;
	},
};

// コンポーネント: TaskViewArea
const TaskViewArea = {
	// レンダー
	view(vnode) {
		const { tasks } = vnode.attrs;
		return <ul>
			{tasks.map(task =>
				<TaskViewEntry
					/* keyを指定しないとコンポーネントとDOMの不一致が起こる可能性がある (Mithril) */
					key={task.key} task={task} />)}
		</ul>;
	},
};

// コンポーネント: TaskViewEntry
const TaskViewEntry = {
	// コンストラクタ
	oninit(vnode) {
		// 外から指定されたプロパティはvnode.attrsにあるがclosureを使うと便利 (Mithril)
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
