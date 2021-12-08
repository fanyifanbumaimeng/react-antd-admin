import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';
class EditForm extends Component {
	componentWillReceiveProps(nextProps) {
		!nextProps.visible && this.props.form.resetFields();
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		const { data } = this.props;
		const formItemLayout = {
			labelCol: { span: 6 },
			wrapperCol: { span: 18 }
		};
		const formTailLayout = {
			labelCol: { span: 6 },
			wrapperCol: { span: 18, offset: 4 }
		};
		// handleSubmit = () => {
		// }
		return (
			<Form onSubmit={() => {
				
			}} refs="editForm">
				<Form.Item label="用户姓名" {...formItemLayout}>
					{getFieldDecorator('nickname', {
						initialValue: data.nickname,
						rules: [
							{
								required: true,
								message: '请输入用户姓名'
							}
						]
					})(<Input />)}
				</Form.Item>
				<Form.Item label="密码" {...formItemLayout}>
					{getFieldDecorator('password', {
						initialValue: data.password,
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
						initialValue: data.username,
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
export default Form.create()(EditForm);
