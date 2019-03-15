import { animate, animation, AnimationReferenceMetadata, style } from '@angular/animations';
export const fadeAnimation: AnimationReferenceMetadata = animation([
  style({ opacity: '{{ from }}' }),
  animate('{{ time }}', style({ opacity: '{{ to }}' })),
], { params: { time: '1s', from: 0, to: 1 } });

export const slideDownAnimation: AnimationReferenceMetadata = animation([
  style({ height: '0' }),
  animate('{{ time }}', style({ height: '*' })),
], { params: { time: '1s'} });
