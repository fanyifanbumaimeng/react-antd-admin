import React, { Component } from 'react';
import { Table, Row, Col, Button, Form, Select, DatePicker, Input } from 'antd';
import $axios from '../../axios/$axios';
import moment from 'moment'
const { RangePicker } = DatePicker
const FormItem = Form.Item;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD HH:mm' || undefined;
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
				title: 'Name',
				dataIndex: 'name',
				sorter: true,
				render: name => `${name.first} ${name.last}`,
				width: '20%'
			},
			{
				title: 'Gender',
				dataIndex: 'gender',
				filters: [{ text: 'Male', value: 'male' }, { text: 'Female', value: 'female' }],
				width: '20%'
			},
			{
				title: 'Email',
				dataIndex: 'email'
			}
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
		debugger
		$axios.get('https://randomuser.me/api', { params: { results: this.state.pagination.pageSize, ...params } }).then(data => {
			const pagination = { ...this.state.pagination };
			pagination.total = 200;
			this.setState({
				loading: false,
				data: data.data.results,
				pagination
			});
		});
	};

	onSelectedRowKeysChange = selectedRowKeys => {
		this.setState({ selectedRowKeys });
	};
	handleSearch = e => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			console.log('Received values of form: ', values);
			const { gender } = values;
			let startTime, endTime;
			if (values?.time?.length) {
				startTime = values?.time[0].valueOf()
				endTime = values?.time[1].valueOf()
			}
			const params = {
				...values,
				startTime,
				endTime,
				page: this.state.pagination.current
			}
			delete params.time;
			this.fetch(params);
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
			showQuickJumper: true
		};
		return (
			<div className="shadow-radius">
				<Form className="search-form" style={{ paddingBottom: 0 }}>
					<Row gutter={24}>
						<Col span={4}>
							<FormItem label="类型">
								{getFieldDecorator('type')(
									<Select placeholder="请选择类型">
										<Option value="1">开关型</Option>
										<Option value="0">模拟型</Option>
									</Select>
								)}
							</FormItem>

						</Col>
						<Col span={4}>
							<FormItem label="时间">
								{getFieldDecorator('time')(
									<RangePicker
										onChange={this.onPickerChange}
										value={this.state.startTime === undefined || this.state.endTime === undefined || this.state.startTime === "" || this.state.endTime === "" ? null : [moment(this.state.startTime, dateFormat), moment(this.state.endTime, dateFormat)]}
										format={dateFormat}
										placeholder={['开始时间', '结束时间']}
									/>
								)}
							</FormItem>

						</Col>
						<Col span={4}>
							<FormItem label="设备名称">
								{getFieldDecorator('name')(
									<Input
										placeholder="设备名称"
										onChange={this.onPickerChange}
										value={this.state.startTime === undefined || this.state.endTime === undefined || this.state.startTime === "" || this.state.endTime === "" ? null : [moment(this.state.startTime, dateFormat), moment(this.state.endTime, dateFormat)]}
										format={dateFormat}
									/>
								)}
							</FormItem>
						</Col>
						<Col span={4}>
							<FormItem label="kks">
								{getFieldDecorator('kks')(
									<Input
										placeholder="请输入kks"
										onChange={this.onPickerChange}
										value={this.state.startTime === undefined || this.state.endTime === undefined || this.state.startTime === "" || this.state.endTime === "" ? null : [moment(this.state.startTime, dateFormat), moment(this.state.endTime, dateFormat)]}
										format={dateFormat}
									/>
								)}
							</FormItem>
						</Col>


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
						</Col>
					</Row>
				</Form>
				<Table bordered columns={this.state.columns} dataSource={this.state.data} loading={this.state.loading} pagination={paginationProps} rowKey={record => record.location.postcode} rowSelection={rowSelection} />
			</div>
		);
	}
}

export default Form.create()(TableSearch);