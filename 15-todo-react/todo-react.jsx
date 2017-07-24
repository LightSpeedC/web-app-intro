
// 基底コンポーネント
class BaseComponent extends React.Component { }

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
	}
}
TaskModel.addModel();

// コンポーネント: TaskApp
class TaskApp extends BaseComponent {
	// コンストラクタ
	constructor(props) {
		super(props);
		this.state = {
			tasks: [
				new TaskModel({ title: 'タスク1' }),
				new TaskModel({ title: 'タスク2', done: true }),
				BaseModel.toModel({ type: 'Task', title: 'タスク3' }),
				BaseModel.toModel({ type: 'Task', title: 'タスク4', done: true }),
			],
		};
	}
	// コンポーネントがマウントされた時
	componentDidMount() {
		debugRedraw = this.debugRedraw;
	}
	// コンポーネントがアンマウントされる時
	componentWillUnmount() {
		debugRedraw = () => { };
	}
	// レンダー
	render() {
		const { tasks } = this.state;
		return <div>
			<b onClick={this.onToggleDebug}>Todo App</b>
			<TaskFormArea onAddTask={this.onAddTask} />
			<TaskViewArea tasks={tasks} />
			<button onClick={this.onRemoveCompleteTasks} children="完了タスクを削除" />
			{debugFlag && <pre style={{ backgroundColor: 'lightgray' }}>{JSON.stringify(tasks, null, '  ')}</pre>}
		</div>;
	}
	// タスクの追加
	onAddTask = (title) =>
		this.setState(s => ({ tasks: s.tasks.concat(new TaskModel({ title })) }));
	// 完了タスクを削除
	onRemoveCompleteTasks = () =>
		this.setState(s => ({ tasks: s.tasks.filter(task => !task.done) }));
	// デバッグをトグル
	onToggleDebug = () => {
		debugFlag = !debugFlag;
		debugRedraw();
	};
	// 再表示
	debugRedraw = () => {
		this.setState({});
	};
}

// コンポーネント: TaskFormArea
class TaskFormArea extends BaseComponent {
	// コンストラクタ
	constructor(props) {
		super(props);
		this.state = { title: '' };
	}
	// レンダー
	render() {
		const { onChange } = this.props;
		const { title } = this.state;
		return <div>
			タスク: <input value={title}
				onChange={this.onChangeTitle}
				onKeyDown={this.onKeyDownTitle} />
			<button type="button" children="追加" onClick={this.onAddTask} />
		</div>;
	}
	// タイトルでキー入力
	onKeyDownTitle = e => {
		if (e.keyCode === 13 && this.state.title) this.onAddTask();
	};
	// タイトル入力
	onChangeTitle = e => this.setState({ title: e.target.value });
	// タスクの追加
	onAddTask = () => {
		(this.props.onAddTask)(this.state.title);
		this.setState({ title: '' });
	};
}

// コンポーネント: TaskViewArea
class TaskViewArea extends BaseComponent {
	// レンダー
	render() {
		const { tasks } = this.props;
		return <ul> {tasks.map(task => < TaskViewEntry task={task} />)} </ul>;
	}
}

// コンポーネント: TaskViewEntry
class TaskViewEntry extends BaseComponent {
	// レンダー
	render() {
		const { task } = this.props;
		const style = {
			color: task.done ? 'lightgray' : 'black',
			textDecoration: task.done ? 'line-through' : 'none'
		};
		return <li style={style} >
			<input type="checkbox"
				checked={task.done}
				onClick={this.onToggleDone} />
			{task.title}
		</li>;
	}
	// 終了フラグをトグル
	onToggleDone = () => {
		const { task } = this.props;
		task.done = !task.done;
		this.setState({});
		debugRedraw();
	};
}

// デバッグフラグは、全体から見えるところに置く
let debugFlag = false;
let debugRedraw = () => { };

// レンダー
ReactDOM.render(<TaskApp />, taskApp);
