import React, { Component } from 'react';
import { Table, Row, Col, Button, Form, Select, Modal } from 'antd';
import $axios from '../../axios/$axios';
import EditForm from './components/EditForm';
import AddForm from './components/AddForm';
const { confirm } = Modal;
const FormItem = Form.Item;
const { Option } = Select;



class TableSearch extends Component {
	state = {
		data: [],
		pagination: {
			pageSize: 20,
			current: 1
		},
		loading: false,
		selectedRowKeys: [],
// 序号，KKS (长度256)，设备名称描述(长度256)，类型，点1路径，点2路径，算法点，打包点，备注；全部读取后分页显示在页面。每页显示20条记录。
		columns: [
			{
				title: '序号',
				dataIndex: 'no',
				sorter: true,
				width: '20%'
			},
			{
				title: 'kks',
				dataIndex: 'kks',
				filters: [{ text: 'Male', value: 'male' }, { text: 'Female', value: 'female' }],
				width: '20%'
			},
			{
				title: '设备名称描述',
				dataIndex: 'desc'
			},
			{
				title: '类型',
				dataIndex: 'type'
			},
			{
				title: '点1路径',
				dataIndex: 'location1'
			},
			{
				title: '点2路径',
				dataIndex: 'location2'
			},
			{
				title: '算法点',
				dataIndex: 'ari'
			},
			{
				title: '打包点',
				dataIndex: 'location3'
			},
			{
				title: '备注',
				dataIndex: 'remark'
			},
			{
				title: '操作',
				dataIndex: 'operation',
				render: (record, data) => {
					return <div>
						<Button onClick={() => {
							confirm({
								title: '温馨提示',
								content: '确定要删除当前内容吗？',
								okText: '确定',
								cancelText: '取消',
								onOk:() => {
									$axios.put('/api/devices', { nos: [data.no] }).then(data => {
										debugger
										this.fetch()
									});
								},
								onCancel() { }
							});
						}}>删除</Button>
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
	fetch = (params = {}) => {
		this.setState({ loading: true });
		$axios.get('/api/devices', { params: { results: this.state.pagination.pageSize, ...params } }).then(data => {
			const pagination = { ...this.state.pagination };
			pagination.total = data.data.total;
			this.setState({
				loading: false,
				data: data.data.list,
				pagination
			});
		});
	};
	
	handleOk = () => {
		this.setState({ visible: false });
	};


	handleCancel = () => {
		this.setState({ visible: false });
	};
	
	addUser = () => {
		this.setState({
			currentRow: {},
			modalVisible: true,
		})
	}
	handleAddSubmit = (values) => {
		this.setState({ loading: true });
		$axios.put('/api/devices', { ...values }).then(data => {
			this.setState({
				loading: false,
				modalVisible: false
			});
			this.fetch()
		});
	}
	
	editUsers = (values) => {
		this.setState({ loading: true });
		$axios.put('/api/devices', { ...values }).then(data => {
			this.setState({
				loading: false,
				visible: false
			});
			this.fetch()
		});
	}
	handleAddVisible = () => {
		this.setState({
			modalVisible: !this.state.modalVisible
		})
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
			showQuickJumper: true,
			showTotal: () => {
				return `总共有 ${this.state?.pagination?.total || 0} 条数据`;
			},
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
									添加新设备
								</Button>
							</FormItem>
						</Col>
					</Row>
				</Form>
				<Modal title="编辑信息" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel} footer={null}>
					<AddForm data={this.state.currentRow} visible={this.state.visible} wrappedComponentRef={form => (this.formRef = form)} handleSubmit={this.handleEditSubmit} />
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
