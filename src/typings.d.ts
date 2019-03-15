/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

// required by diagram module from ngx-df and because we have noImplicitAny compiler option enabled
declare module 'dagre-d3' {
  const any: any;

  export = any;
}
