import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Select, Icon, Button, Card, Upload, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getConsumption } from '../../services/api';

const FormItem = Form.Item;

@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
class BasicForms extends PureComponent {
  state = {
    fileList: [],
    items: [],
  };

  componentDidMount() {
    getConsumption().then(responseData => {
      const items = Object.values(responseData).reduce((acc, timestamps) => {
        Object.values(timestamps).forEach(items => {
          items.forEach(item => acc.add(item.name));
        });
        return acc;
      }, new Set());
      this.setState({ items: [...items] });
    });
  }

  handleSubmit = e => {
    const { form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll(err => {
      if (!err) {
        message.success('Successfully uploaded files!');
        form.resetFields();
        this.setState({ fileList: [] });
      }
    });
  };

  render() {
    const { submitting } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <PageHeaderWrapper title="Upload" content="Upload food images for item recognition.">
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="Item name">
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: 'Please select the item',
                  },
                ],
              })(
                <Select placeholder="Select item">
                  {this.state.items.map(item => (
                    <Select.Option key={item}>{item}</Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <Upload.Dragger
              directory
              fileList={this.state.fileList}
              onChange={({ fileList }) => this.setState({ fileList })}
            >
              <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
              </p>
              <p className="ant-upload-text">Click or drag files to this area to upload</p>
            </Upload.Dragger>

            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                Submit
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default BasicForms;
