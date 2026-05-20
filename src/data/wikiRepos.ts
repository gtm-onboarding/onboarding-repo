export interface WikiRepo {
  id: string;
  name: string;
  description: string;
  url: string;
  language: string;
  topics: string[];
}

export const wikiRepos: WikiRepo[] = [
  {
    id: 'opentelemetry-demo',
    name: 'opentelemetry-demo',
    description:
      'OpenTelemetry Astronomy Shop — a microservice-based distributed system that demonstrates OpenTelemetry instrumentation and observability in a near real-world environment.',
    url: 'https://github.com/alexmacneil-cognition/opentelemetry-demo',
    language: 'Go',
    topics: ['opentelemetry', 'microservices', 'observability', 'distributed-systems', 'docker', 'kubernetes'],
  },
];
