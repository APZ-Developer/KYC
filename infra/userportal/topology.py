import builtins
from infra.configsettings import ConfigManager

from aws_cdk.aws_stepfunctions import StateMachineType
from infra.storage.topology import RivSharedDataStores
from infra.userportal.functions.topology import RivUserPortalFunctionSet
from infra.userportal.states.topology import RivUserPortalStateMachines
from infra.userportal.gateway.topology import RivUserPortalGateway
from json import dumps
from infra.interfaces import IVpcRivStack
from aws_cdk import (
  core,
)

config = ConfigManager()
class RivUserPortal(core.Construct):
  def __init__(self, scope: core.Construct, id: builtins.str, riv_stack:IVpcRivStack, sharedStorage, subnet_group_name:str='Default') -> None:
    super().__init__(scope, id)
    
    if config.use_isolated_subnets:
      '''
      Declare any VPC endpoints required by this construct.
      '''
      riv_stack.networking.endpoints.add_lambda_support()
      riv_stack.networking.endpoints.add_apigateway_support()
      riv_stack.networking.endpoints.add_rekognition_support()

    '''
    Declare the function set that powers the backend
    '''
    self.functions = RivUserPortalFunctionSet(self,'Functions',
      riv_stack=riv_stack,
      subnet_group_name=subnet_group_name,
      sharedStorage=sharedStorage)

    '''
    Create an Amazon API Gateway and register Step Function Express integrations.
    '''
    self.api_gateway = RivUserPortalGateway(self,'Gateway', riv_stack=riv_stack)
    self.state_machines = RivUserPortalStateMachines(self,'States',
      riv_stack=riv_stack,
      functions=self.functions,
      state_machine_type= StateMachineType.EXPRESS)

    self.api_gateway.bind_state_machines(self.state_machines)

    '''
    Create Standard Stepfunctions to simplify developer troubleshooting.
    '''
    self.debug_state_machines = RivUserPortalStateMachines(self,'DebugStates',
      riv_stack=riv_stack,
      functions=self.functions,
      state_machine_type= StateMachineType.STANDARD)