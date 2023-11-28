import { FC } from 'react'
import useLocalStorage from '../../../useLocalStorage';
import {Input, Form, Button, Checkbox} from 'antd'
  
//   const onFinishFailed = (errorInfo: any) => {
//     console.log('Failed:', errorInfo);
//   };
  
  type FieldType = {
    username?: string;
    password?: string;
    remember?: string;
  };

const FormChild: FC<{tabKey: string}>= ({tabKey}) => {
    const [value, setValue] = useLocalStorage(tabKey, { remember: true });
    const [form] = Form.useForm();

    const handleChange = () => {
        const data = form.getFieldsValue(true);
        data && setValue(data);
        console.log('useEffect: ', form.getFieldsValue(true));
    };

    const onFinish = (values: any) => {
        console.log('Success:', values);
        setValue(values);
    };

    // const handleCancel = () => {
        
    // }

    return (
        <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            onChange={handleChange}
            initialValues={value}
            onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
            form={form}
        >
            <Form.Item<FieldType>
                label="Username"
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
                >
                <Input />
                </Form.Item>

                <Form.Item<FieldType>
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
                >
                <Input.Password />
                </Form.Item>

                <Form.Item<FieldType>
                name="remember"
                valuePropName="checked"
                wrapperCol={{ offset: 8, span: 16 }}
                >
                <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    )
}

export default FormChild;