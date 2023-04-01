import { UUID } from 'bson';

export interface KafkaWrapper<T> {
    key: UUID,
    value: T
    offset: string,
    topic: string,
    headers: {
      Authorization: string
    }
}