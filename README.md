# should-skip-update

`should-skip-update` is sort of like a spiritual successor to React's `shouldComponentUpdate` lifecycle method. Used in junction with [`memo`](https://reactjs.org/docs/react-api.html#reactmemo), `should-skip-update` can be used to avoid unnecessary renders.

`memo` is great for quick, shallow prop comparisons, but sometimes you want more fine-tuned control. You can pass a function as the second argument to perform more complex comparisons, but sometimes you just want to compare the specific keys you use on an object passed as a prop.

## Usage

**Problem**
```
const MyComponent = ({ order }) => {
    return <div>{order.notes}</div>
}

export default memo(MyComponent)

// ...

<MyParentComponent>
    <MyComponent order={{
        notes: "Hello World"
    }} />
</MyParentComponent>

```

In this situation, `MyComponent` will rerender every time `MyParentComponent` renders because the `order` prop is technically a new object each time, making `memo` effectively useless. This is where `should-skip-update` comes into play!

**Solution**
```
import shouldSkipUpdate from 'should-skip-update'

const MyComponent = ({ order }) => {
    return <div>{order.notes}</div>
}

export default memo(MyComponent, shouldSkipUpdate(['order.notes']))

// ...

<MyParentComponent>
    <MyComponent order={{
        notes: "Hello World"
    }} />
</MyParentComponent>

```

Now `MyComponent` will only rerender if the `notes` property of the `order` prop changes despite `order` being a new object for each render of `MyParentComponent`. This is obviously a very simple example where just using a `notes` prop would make more sense, but this becomes much more useful with larger, more complex components that may work with many properties of a single prop object.

`shouldSkipUpdate` takes an array of dot notation properties that it will compare for each render. If every property specified is the same value as the previous render, rendering will be skipped.

## ESLint Plugin

`should-skip-update` also comes with an optional dependency `eslint-plugin-should-skip-update` that helps make sure every prop property you use in a component is passed to the `shouldSkipUpdate` function. It acts sort of like a combination of the `react/prop-types` and `react-hooks/exhaustive-deps` eslint rules.

### More Complex Example

In the component below, the `order` prop has many more properties than just the ones used in the `OrderDetails` component, and we don't want to rerender just because a property on `order` changed that isn't even used here. `shouldSkipUpdate` makes it so we can still pass the whole `order` object as a prop for convenience, but only rerender when necessary.

The eslint plugin makes this extra easy because it will notify you if and what props you're missing in the `shouldSkipUpdate` dependency array.

```
import React, { memo } from 'react'

import { Card, Col, Row, CardBody, CardHeader, FormGroup, Input } from 'reactstrap'

import shouldSkipUpdate from 'should-skip-update'

function OrderDetails({ order, topics, objectives, editing, handleInputChange, setState }) {
    return (
        <Card className="mb-2">
            <CardHeader>Order Details</CardHeader>
            <CardBody>
                <Row>
                    <Col sm="2" className="mb-2">
                        <Input
                            label="Job #"
                            type="text"
                            name="job_number"
                            id="job_number"
                            onChange={handleInputChange}
                            disabled
                            value={order.job_number}
                        />
                    </Col>
                    <Col sm="2" className="mb-2">
                        <Input
                            label="Invoice #"
                            type="text"
                            name="invoice_number"
                            id="invoice_number"
                            disabled
                            value={order.invoice_number}
                        />
                    </Col>
                    {!order.is_add_on && order.related_orders.length > 0 && (
                        <Col sm="3">
                            <div>Related Orders</div>
                            {order.related_orders.map((o) => (
                                <a key={o.id} href={`/orders/${o.id}`}>
                                    {o.job_number}
                                </a>
                            ))}
                        </Col>
                    )}
                    <Col sm="6">
                        <FormGroup>
                            <Input
                                name="objective_id"
                                label="Objective*"
                                type="select"
                                value={order.objective_id}
                                onChange={handleInputChange}
                                disabled={!editing}
                            >
                                <option value="" disabled>
                                    Select a objective
                                </option>
                                {objectives.map((objective) => (
                                    <option key={objective.id} value={objective.id}>
                                        {objective.name}
                                    </option>
                                ))}
                            </Input>
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Input
                                name="topic_id"
                                label="Topic*"
                                type="select"
                                value={order.topic_id}
                                onChange={handleInputChange}
                                disabled={!editing}
                            >
                                <option value="" disabled>
                                    Select a topic
                                </option>
                                {topics.map((topic) => (
                                    <option key={topic.id} value={topic.id}>
                                        {topic.name}
                                    </option>
                                ))}
                            </Input>
                        </FormGroup>
                    </Col>
                    <Col sm="12">
                        <FormGroup>
                            <Input
                                name="headline"
                                label="Headline*"
                                type="text"
                                value={order.headline}
                                onChange={handleInputChange}
                                disabled={!editing}
                            />
                        </FormGroup>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    )
}

export default memo(
    OrderDetails,
    shouldSkipUpdate([
        'editing',
        'handleInputChange',
        'setState',
        'topics',
        'objectives',
        'order.job_number',
        'order.invoice_number',
        'order.is_add_on',
        'order.related_orders',
        'order.objective_id',
        'order.topic_id',
        'order.headline',
    ]),
)
```


