import React, { Component } from 'react';
import { Form, Input, Button, Radio } from 'antd';
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
				<Form.Item label="kks" {...formItemLayout}>
					{getFieldDecorator('kks', {
						initialValue: data.kks,
						rules: [
							{
								required: true,
								message: '请输入kks'
							}
						]
					})(<Input onChange={() => {
						debugger
					}} />)}
				</Form.Item>
				<Form.Item label="设备名称" {...formItemLayout}>
					{getFieldDecorator('name', {
						initialValue: data.name,
						rules: [
							{
								required: true,
								message: '请输入设备名称'
							}
						]
					})(<Input />)}
				</Form.Item>
				<Form.Item label="类型" {...formItemLayout}>
					{getFieldDecorator('type', {
						initialValue: data.type,
						rules: [
							{
								required: true,
								message: '请输入正确的账号',
							}
						]
					})(<Radio.Group>
						<Radio value="0">开关型</Radio>
						<Radio value="1">模拟型</Radio>
					</Radio.Group>
)}
				</Form.Item>
				<Form.Item label="点1路径" {...formItemLayout}>
					{getFieldDecorator('point1Path', {
						initialValue: data.point1Path,
						rules: [
							{
								required: true,
								message: '请输入点1路径'
							}
						]
					})(<Input />)}
				</Form.Item>
				<Form.Item label="点2路径" {...formItemLayout}>
					{getFieldDecorator('point2Path', {
						initialValue: data.point2Path,
						rules: [
							{
								required: true,
								message: '请输入点2路径'
							}
						]
					})(<Input />)}
				</Form.Item>
				<Form.Item label="算法点" {...formItemLayout}>
					{getFieldDecorator('algorithmPoint', {
						initialValue: data.algorithmPoint,
						rules: [
							{
								required: true,
								message: '请输入算法点'
							}
						]
					})(<Input />)}
				</Form.Item>
				<Form.Item label="打包点" {...formItemLayout}>
					{getFieldDecorator('packagePoint', {
						initialValue: data.packagePoint,
						rules: [
							{
								required: true,
								message: '请输入打包点'
							}
						]
					})(<Input />)}
				</Form.Item>
				<Form.Item label="备注" {...formItemLayout}>
					{getFieldDecorator('remark', {
						initialValue: data.remark,
						rules: [
							{
								required: true,
								message: '请输入备注',
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
