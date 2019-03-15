#!groovy​

properties([
  parameters([
    booleanParam(name: 'cleanWorkspace', defaultValue: false, description: 'Cleans the entire workspace.'),
    booleanParam(name: 'cleanNodeModules', defaultValue: false, description: 'Removes the node_modules directory.'),
    string(name: 'ngBuildArgs', defaultValue: '--prod', description: 'ng build arguments'),
    string(name: 'backendUrl', defaultValue: 'https://reqres.in/api', description: 'Backend URL.'),
    string(name: 'nodeVersion', defaultValue: 'nodejs-latest', description: 'NodeJS version to be used in build.'),
    string(name: 'portNumber', defaultValue: '80', description: 'Exposed Docker Port'),
    string(name: 'ecs', defaultValue: '{ "cluster": "CN-SWARM", "service": "dfproto-xoengeasier-ui", "taskFamily": "dfproto-xoengeasier-ui", "updateService": true, "region": "us-east-1", "docker": { "imagename": "dfproto-xoengeasier-ui", "tag": "latest", "registry": { "prefix": "registry.devfactory.com/", "suffix": "devfactory/" } } }', description: 'AWS ECS Parameters')
  ])
])


@NonCPS
def populateEnv(){ binding.variables.each{k,v -> env."$k" = "$v"} }
populateEnv()

@Library('components-build')
def pipe = new com.devfactory.components.build.PipelineNG()
pipe.execute(env)
