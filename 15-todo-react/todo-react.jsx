// todo-react.jsx

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

// 基底コンポーネント
class BaseComponent extends React.Component { }

// コンポーネント: TaskApp
class TaskApp extends BaseComponent {
	// コンストラクタ
	constructor(props) {
		super(props);
		this.state = {
			tasks: [
				new TaskModel({ title: 'タスク1' }),
				new TaskModel({ title: 'タスク2', done: true }),
				BaseModel.create({ type: 'TaskModel', title: 'タスク3' }),
				BaseModel.create({ type: 'TaskModel', title: 'タスク4', done: true }),
			],
		};
	}
	// コンポーネントがマウントされた時
	// componentDidMount() { debugRedraw = this.debugRedraw; }
	// コンポーネントがアンマウントされる時
	// componentWillUnmount() { debugRedraw = () => { }; }
	// タスクの追加
	// arrow function 形式で this を bind (React)
	onAddTask = title =>
		this.setState(s => ({ tasks: s.tasks.concat(new TaskModel({ title })) }));
	// 完了タスクを削除
	// arrow function 形式で this を bind (React)
	onRemoveCompleteTasks = () =>
		this.setState(s => ({ tasks: s.tasks.filter(task => !task.done) }));
	// デバッグをトグル
	onToggleDebug = () => {
		debugFlag = !debugFlag;
		this.setState({});
		// debugRedraw();
	};
	// 再表示
	// arrow function 形式で this を bind (React)
	onChanged = () => this.setState({});
	// debugRedraw = () => this.setState({});
	// レンダー
	render() {
		const { tasks } = this.state;
		return <div>
			<b onClick={this.onToggleDebug}>Todo App (React)</b>
			<TaskFormArea
				onAddTask={this.onAddTask} />
			<TaskViewArea
				onChanged={this.onChanged} /* 子の変更を親に伝えるため (React) */
				tasks={tasks} />
			<button type="button"
				disabled={tasks.every(task => !task.done)}
				onClick={this.onRemoveCompleteTasks}
				>完了タスクを削除</button>
			{debugFlag && <pre style={{ backgroundColor: 'lightgray' }}>{JSON.stringify(tasks, null, '  ')}</pre>}
		</div>;
	}
}

// コンポーネント: TaskFormArea
class TaskFormArea extends BaseComponent {
	// コンストラクタ
	constructor(props) {
		super(props);
		this.state = { title: '' };
	}
	// タイトルでキー入力
	// arrow function 形式で this を bind (React)
	onKeyDownTitle = e =>
		e.key === 'Enter' || e.keyCode === 13 ? this.onAddTask() : void 0;
	// タイトル入力
	// arrow function 形式で this を bind (React)
	onChangeTitle = e => this.setState({ title: e.target.value });
	// タスクの追加
	// arrow function 形式で this を bind (React)
	onAddTask = () => {
		this.state.title &&
		(this.props.onAddTask)(this.state.title);
		this.setState({ title: '' });
	};
	// レンダー
	render() {
		const { title } = this.state;
		return <div>
			タスク: <input type="text" value={title}
				onChange={this.onChangeTitle}
				onKeyDown={this.onKeyDownTitle} />
			<button type="button"
				disabled={!title}
				onClick={this.onAddTask}
				>追加</button>
		</div>;
	}
}

// コンポーネント: TaskViewArea
class TaskViewArea extends BaseComponent {
	// レンダー
	render() {
		const { tasks } = this.props;
		const { onChanged } = this.props; // 子の変更を親に伝えるため (React)
		return <ul>
			{tasks.map(task =>
				<TaskViewEntry
					onChanged={onChanged} /* 子の変更を親に伝えるため (React) */
					key={task.key} task={task} />)}
		</ul>;
	}
}

// コンポーネント: TaskViewEntry
class TaskViewEntry extends BaseComponent {
	// 終了フラグをトグル
	// arrow function 形式で this を bind (React)
	onToggleDone = () => {
		const { task } = this.props;
		const { onChanged } = this.props; // 子の変更を親に伝えるため (React)
		task.done = !task.done;
		onChanged && onChanged(); // 子の変更を親に伝えるため (React)
		// this.setState({});
		// ↑stateは無いが再表示が必要 親がrenderするなら不要 (React)
		// debugRedraw();
	};
	// レンダー
	render() {
		const { task } = this.props;
		const style = {
			color: task.done ? 'lightgray' : 'black',
			textDecoration: task.done ? 'line-through' : 'none'
		};
		return <li style={style} onClick={this.onToggleDone} >
			<input type="checkbox" checked={task.done} />
			{task.title}
		</li>;
	}
}

// デバッグフラグは、全体から見えるところに置く
let debugFlag = false;
// let debugRedraw = () => { };

// レンダー
ReactDOM.render(<TaskApp />, taskApp);
