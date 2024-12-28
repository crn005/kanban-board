import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import './App.css'

const initialData = {
	columns: {
		'column-1': {
			id: 'column-1',
			title: 'To Do',
			taskIds: ['task-1', 'task-2'],
		},
		'column-2': {
			id: 'column-2',
			title: 'In Progress',
			taskIds: ['task-3'],
		},
		'column-3': {
			id: 'column-3',
			title: 'Done',
			taskIds: [],
		},
	},
	tasks: {
		'task-1': { id: 'task-1', content: 'Learn React' },
		'task-2': { id: 'task-2', content: 'Build a project' },
		'task-3': { id: 'task-3', content: 'Read documentation' },
	},
	columnOrder: ['column-1', 'column-2', 'column-3'],
}

function App() {
	const [data, setData] = useState(initialData)

	const onDragEnd = result => {
		const { source, destination, draggableId } = result

		if (!destination) return

		if (
			source.droppableId === destination.droppableId &&
			source.index === destination.index
		) {
			return
		}

		const startColumn = data.columns[source.droppableId]
		const endColumn = data.columns[destination.droppableId]

		if (startColumn === endColumn) {
			const newTaskIds = Array.from(startColumn.taskIds)
			newTaskIds.splice(source.index, 1)
			newTaskIds.splice(destination.index, 0, draggableId)

			const newColumn = {
				...startColumn,
				taskIds: newTaskIds,
			}

			setData(prevData => ({
				...prevData,
				columns: {
					...prevData.columns,
					[newColumn.id]: newColumn,
				},
			}))
			return
		}

		const startTaskIds = Array.from(startColumn.taskIds)
		startTaskIds.splice(source.index, 1)
		const newStartColumn = {
			...startColumn,
			taskIds: startTaskIds,
		}

		const endTaskIds = Array.from(endColumn.taskIds)
		endTaskIds.splice(destination.index, 0, draggableId)
		const newEndColumn = {
			...endColumn,
			taskIds: endTaskIds,
		}

		setData(prevData => ({
			...prevData,
			columns: {
				...prevData.columns,
				[newStartColumn.id]: newStartColumn,
				[newEndColumn.id]: newEndColumn,
			},
		}))
	}

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<div className='App'>
				{data.columnOrder.map(columnId => {
					const column = data.columns[columnId]
					const tasks = column.taskIds.map(taskId => data.tasks[taskId])

					return <Column key={column.id} column={column} tasks={tasks} />
				})}
			</div>
		</DragDropContext>
	)
}

function Column({ column, tasks }) {
	return (
		<div className='column'>
			<h3>{column.title}</h3>
			<Droppable droppableId={column.id}>
				{provided => (
					<div
						{...provided.droppableProps}
						ref={provided.innerRef}
						className='task-list'
					>
						{tasks.map((task, index) => (
							<Task key={task.id} task={task} index={index} />
						))}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</div>
	)
}

function Task({ task, index }) {
	return (
		<Draggable draggableId={task.id} index={index}>
			{provided => (
				<div
					className='task'
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					ref={provided.innerRef}
				>
					{task.content}
				</div>
			)}
		</Draggable>
	)
}

export default App
