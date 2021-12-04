import React, { Component } from 'react';
import { Table, Row, Col, Button, Form, Select, Modal, message } from 'antd';
import $axios from '../../axios/$axios';
import { Link } from 'react-router-dom'
import EditForm from '../../components/EditForm';
import AddForm from '../../components/AddForm';

const { confirm } = Modal;
const FormItem = Form.Item;
const { Option } = Select;
class TableSearch extends Component {
	state = {
		data: [],
		pagination: {
			pageSize: 10,
			current: 1
		},
		loading: false,
		selectedRowKeys: [],
		columns: [
			{
				title: 'id',
				dataIndex: 'id',
				width: '20%'
			},
			{
				title: '用户姓名',
				dataIndex: 'nickname',
				sorter: true,
				width: '20%'
			},
			{
				title: '账号',
				dataIndex: 'username'
			},
			// accountType
			{
				title: '账号类型',
				dataIndex: 'accountType',
				render: (record) => {
					return record === 1 ? '普通用户': '管理员'
				}
			},
			{
				title: '操作',
				dataIndex: 'operation',
				render: (record, data) => {
					return <div>
						{/* <Button onClick={() => {
							
						}}>删除</Button> */}
						<Button onClick={() => {
							this.setState({ currentRow: data, visible: true });
						}}>编辑</Button>
					</div>
				}
			},
		]
	};

	componentWillMount() {
		this.fetch();
	}

	componentWillUnmount() {
		// componentWillMount进行异步操作时且在callback中进行了setState操作时，需要在组件卸载时清除state
		this.setState = () => {
			return;
		};
	}
	// 切换分页
	handleTableChange = page => {
		const pager = { ...this.state.pagination };
		pager.current = page;
		this.setState({ pagination: pager }, () => {
			this.fetch({ page: this.state.pagination.current });
		});
	};
	handleAddVisible = () => {
		this.setState({
			modalVisible: !this.state.modalVisible
		})
	}
	fetch = (params = {}) => {
		this.setState({ loading: true });
		$axios.get('/api/sysUser', { params: { results: this.state.pagination.pageSize, ...params } }).then(data => {
			const pagination = { ...this.state.pagination };
			pagination.total = data.data.total;
			this.setState({
				loading: false,
				data: data.data.list,
				pagination
			});
		});
	};
	editUsers = (values) => {
		this.setState({ loading: true });
		$axios.put('/api/sysUser', { ...values }).then(data => {
			this.setState({
				loading: false,
				
			});
			this.fetch()
		});
	}
	handleEditSubmit = (values) => {
		const { currentRow } = this.state;
		this.editUsers({
			dataList: [{
				...currentRow,
				...values,
			}]
		})
		debugger
	}
	handleDel(row) {
		confirm({
			title: '温馨提示',
			content: '确定要删除当前内容吗？',
			okText: '确定',
			cancelText: '取消',
			onOk() {
				message.info('你点击了确定，当前行key为：' + row.key, 1);
			},
			onCancel() { }
		});
	}
	handleOk = () => {
		this.setState({ visible: false });
	};


	handleCancel = () => {
		this.setState({ visible: false });
	};

	onSelectedRowKeysChange = selectedRowKeys => {
		this.setState({ selectedRowKeys });
	};
	handleSearch = e => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			console.log('Received values of form: ', values);
			const { gender } = values;
			if (gender) {
				this.fetch({
					gender,
					page: this.state.pagination.current
				});
			}
		});
	};
	handleReset = () => {
		this.props.form.resetFields();
		this.fetch();
	};
	addUser = () => {
		this.setState({
			currentRow: {},
			modalVisible: true,
		})
	}
	handleAddSubmit = (values) => {
		this.setState({ loading: true });
		$axios.put('/api/sysUser', { ...values }).then(data => {
			this.setState({
				loading: false,
				modalVisible: false
			});
			this.fetch()
		});
	}
	deleteUsers = async () => {
		const { selectedRowKeys } = this.state;
		confirm({
			title: '温馨提示',
			content: '确定要删除当前内容吗？',
			okText: '确定',
			cancelText: '取消',
			onOk() {
				$axios.post('/api/sysUser', { ids: selectedRowKeys }).then(data => {
				});
			},
			onCancel() { }
		});

		// /api/sysUser
	}
	
	onShowSizeChange(current, pageSize) {
		const pagination = { ...this.state.pagination };
		pagination.pageSize = pageSize;
		pagination.current = current;
		this.setState({ pagination }, () => {
			this.fetch({ results: this.state.pagination.pageSize, page: this.state.pagination.current });
		});
	}

	render() {
		const { selectedRowKeys } = this.state;
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectedRowKeysChange
		};
		const { getFieldDecorator } = this.props.form;
		const paginationProps = {
			onChange: page => this.handleTableChange(page),
			onShowSizeChange: (current, pageSize) => this.onShowSizeChange(current, pageSize), //  pageSize 变化的回调
			...this.state.pagination,
			showSizeChanger: true,
			showQuickJumper: true
		};
		return (
			<div className="shadow-radius">
				<Form className="search-form" style={{ paddingBottom: 0 }}>
					<Row gutter={24}>
						{/* <Col span={4}>
							<FormItem label="Gender">
								{getFieldDecorator('gender')(
									<Select placeholder="请选择">
										<Option value="male">male</Option>
										<Option value="female">female</Option>
									</Select>
								)}
							</FormItem>
						</Col> */}
						<Col span={2} style={{ marginRight: '10px', display: 'flex' }} className="serarch-btns">
							<FormItem>
								<Button icon="search" type="primary" htmlType="submit" className={'btn'} onClick={this.handleSearch}>
									搜索
								</Button>
							</FormItem>
							<FormItem>
								<Button className={'btn'} onClick={this.handleReset}>
									重置
								</Button>
							</FormItem>
							<FormItem>
								<Button className={'btn'} onClick={this.addUser}>
									添加新用户
								</Button>
							</FormItem>
							<FormItem>
								<Button className={'btn'} onClick={this.deleteUsers}>
									删除用户
								</Button>
							</FormItem>
						</Col>
					</Row>
				</Form>
				<Modal title="编辑信息" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel} footer={null}>
					<EditForm data={this.state.currentRow} visible={this.state.visible} wrappedComponentRef={form => (this.formRef = form)} handleSubmit={this.handleEditSubmit} />
				</Modal>
				<Modal title="添加用户" visible={this.state.modalVisible} onOk={this.handleAddVisible} onCancel={this.handleAddVisible} footer={null}>
					<AddForm visible={this.state.modalVisible} wrappedComponentRef={form => (this.formRef = form)} handleSubmit={this.handleAddSubmit} />
				</Modal>
				<Table bordered columns={this.state.columns} dataSource={this.state.data} loading={this.state.loading} pagination={paginationProps} rowKey={record => record.id} rowSelection={rowSelection} />
			</div>
		);
	}
}

export default Form.create()(TableSearch);
