import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';
class AddForm extends Component {
	componentWillReceiveProps(nextProps) {
		!nextProps.visible && this.props.form.resetFields();
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		const { data = {} } = this.props;
		const formItemLayout = {
			labelCol: { span: 4 },
			wrapperCol: { span: 20 }
		};
		const formTailLayout = {
			labelCol: { span: 4 },
			wrapperCol: { span: 20, offset: 4 }
		};
		// handleSubmit = () => {
		// }
		return (
			<Form refs="addForm">
				<Form.Item label="用户姓名" {...formItemLayout}>
					{getFieldDecorator('nickname', {
						initialValue: '',
						rules: [
							{
								required: true,
								message: '请输入用户姓名'
							}
						]
					})(<Input onChange={() => {
					}} />)}
				</Form.Item>
				<Form.Item label="密码" {...formItemLayout}>
					{getFieldDecorator('password', {
						initialValue: '',
						rules: [
							{
								required: true,
								message: '请输入密码'
							}
						]
					})(<Input />)}
				</Form.Item>
				<Form.Item label="账号" {...formItemLayout}>
					{getFieldDecorator('username', {
						initialValue: '',
						rules: [
							{
								required: true,
								message: '请输入正确的账号',
							}
						]
					})(<Input />)}
				</Form.Item>
				<Form.Item {...formTailLayout}>
					<Button type="submit" onClick={(e) => {
						e.preventDefault();
						this.props.form.validateFieldsAndScroll((err, values) => {
							if (!err) {
								this.props.handleSubmit(values)
								console.log('Received values of form: ', values);
							}
						});
					}}>
						提交
					</Button>
				</Form.Item>
			</Form>
		);
	}
}
export default Form.create()(AddForm);
