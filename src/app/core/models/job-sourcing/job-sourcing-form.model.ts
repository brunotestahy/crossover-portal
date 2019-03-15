export interface JobSourcingForm {
  jbpEnabled?: boolean;
  jbpInstructions?: string | null;
  outboundEnabled?: boolean;
  outboundInstructions?: string | null;
  priority?: number | string | null;
  sourcingInstructions?: string | null;
}
