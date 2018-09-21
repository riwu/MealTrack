import React, { PureComponent } from 'react';
import { BarChart, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';
import DefaultTooltipContent from 'recharts/lib/component/DefaultTooltipContent';
import { Form, Select, Card } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';
import { getConsumption } from '../../services/api';
import { getWastage, getUpliftQty } from './Wastage';

class Visualise extends PureComponent {
  state = {
    data: {},
    flight: null,
    time: null,
  };

  componentDidMount() {
    getConsumption().then(data => {
      const dataArr = Object.entries(data);
      if (!dataArr.length) return;
      const [flight, timestamps] = dataArr[0];
      this.setState({ data, flight, time: Object.keys(timestamps)[0] });
    });
  }

  render() {
    const { data, flight, time } = this.state;
    const processedData = ((data[flight] || {} || {})[time] || []).map(item => {
      const upliftQty = getUpliftQty(item.qty);
      return {
        ...item,
        unconsumed: upliftQty - item.qty,
        wastage: getWastage(item.qty, upliftQty),
      };
    });
    return (
      <PageHeaderWrapper title="Visualise Food Wastage">
        <Card bordered={false}>
          <Form layout="inline" style={{ paddingBottom: '50px' }}>
            <Form.Item label="Flight" style={{ padding: '0 80px' }}>
              <Select
                style={{ width: '100px' }}
                size="large"
                value={flight}
                onSelect={value =>
                  this.setState({ flight: value, time: Object.keys(data[value])[0] })
                }
              >
                {Object.keys(data).map(option => (
                  <Select.Option key={option}>{option}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Date">
              <Select value={time} onSelect={value => this.setState({ time: value })}>
                {Object.keys(data[flight] || {}).map(option => (
                  <Select.Option key={option}>
                    {moment(option * 1000).format('YYYY-MM-DD, ddd ha')}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
          <BarChart width={730} height={250} data={processedData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              content={props => (
                <DefaultTooltipContent
                  {...props}
                  payload={[
                    ...props.payload,
                    {
                      name: 'Wastage',
                      value: `${(((props.payload || [])[0] || {}).payload || {}).wastage}%`,
                    },
                  ]}
                />
              )}
            />
            <Legend />
            <Bar name="Consumed" dataKey="qty" fill="#82ca9d" stackId="a" />
            <Bar name="Unconsumed" dataKey="unconsumed" fill="#8884d8" stackId="a" />
          </BarChart>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Visualise;
