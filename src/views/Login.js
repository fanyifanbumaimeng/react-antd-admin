import React, { Component } from 'react';
import { Form, Icon, Input, Button, message } from 'antd';
import { connect } from 'react-redux';
import { setUserInfo } from '@/redux/actions/userInfo';
import '@/assets/css/login';
import $axios from '../axios/$axios';

const FormItem = Form.Item;
class Login extends Component {
	state = { clientHeight: document.documentElement.clientHeight || document.body.clientHeight };
	constructor(props) {
		super(props);
		this.onResize = this.onResize.bind(this);
	}
	login = e => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				localStorage.setItem('isLogin', '1');
				// 模拟生成一些数据
				$axios.post('/api/sysUser/login', values).then(res => {
					if (res.data) {
						$axios.defaults.headers.common["Authorization"] = `Bearer  ${res.data.token}`;
						localStorage.setItem('Authorization', `Bearer  ${res.data.token}`);
						const { userInfo } = res.data;
						localStorage.setItem('userInfo', JSON.stringify(userInfo));

						this.props.setUserInfo(userInfo);
						this.props.history.push('/');

					} else {
						message.info(res.message)
					}
				});
			} else {
				console.log(err);
			}
		});
	};
	componentDidMount() {
		window.addEventListener('resize', this.onResize);
	}
	componentWillUnmount() {
		window.addEventListener('resize', this.onResize);
		// componentWillMount进行异步操作时且在callback中进行了setState操作时，需要在组件卸载时清除state
		this.setState = () => {
			return;
		};
	}
	onResize() {
		this.setState({ clientHeight: document.documentElement.clientHeight || document.body.clientHeight });
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		return (
			<div className="container">
				<div className="content">
					<div className="title">操作记录查询展示系统</div>
					<Form className="login-form">
						<FormItem>
							{getFieldDecorator('username', {
								rules: [{ required: true, message: '请填写用户名！' }]
							})(<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />)}
						</FormItem>
						<FormItem>
							{getFieldDecorator('password', {
								rules: [{ required: true, message: '请填写密码！' }]
							})(<Input.Password prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="密码" />)}
						</FormItem>
						<FormItem>
							<Button type="primary" htmlType="submit" block onClick={this.login}>
								登录
							</Button>
							{/* <div style={{ color: '#999',paddingTop:'10px',textAlign:'center' }}>Tips : 输入任意用户名密码即可</div> */}
						</FormItem>
					</Form>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({
	setUserInfo: data => {
		dispatch(setUserInfo(data));
	}
});
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Form.create()(Login));
