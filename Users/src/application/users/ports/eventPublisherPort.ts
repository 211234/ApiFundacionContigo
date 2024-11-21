export interface EventPublisherPort {
    publish(event: string, data: any): Promise<void>;
}
