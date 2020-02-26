function LocacaoController($scope, $http, $state, $location, $rootScope, SweetAlert, notify) {

    var url = 'http://' + location.host;

    $scope.formData = {
        id_imovel: '',
        endereco: ''
    }

    $scope.formData.error = {
        endereco: false
    }

    $scope.input_busca = '';

    $scope.limparCampos = function () {
        $scope.formData.id_imovel = '';
        $scope.formData.endereco = '';
        $scope.formData.id_proprietario = '';
    }

    $scope.salvarLocacao = function () {
        $scope.formData.error.endereco = false;
        
        if ($scope.formData.endereco.length <= 2) {
            $scope.formData.error.endereco = true;
        }
        if ($scope.formData.error.endereco || $scope.formData.error.id_proprietario) {
            SweetAlert.swal({
                title: "Ops!",
                text: 'Campo em destaque obrigatório!',
                type: "error"
            });
        } else {
            $http.get(url + '/controllers/imovel.php?acao=salvar&'+
                '&id_imovel='         + $scope.formData.id_imovel+
                '&endereco='          + $scope.formData.endereco+
                '&id_proprietario='   + $scope.formData.id_proprietario
            ).then(function (response) {
                if (response.status) {

                    SweetAlert.swal({
                        title: "Imóvel salvo com sucesso!",
                        text: "Deseja iniciar uma Locação?",
                        type: "success",
                        showCancelButton: true,
                        confirmButtonColor: "#1c84c6",
                        confirmButtonText: "Iniciar Locação",
                        cancelButtonText: "Fechar",
                        closeOnConfirm: false,
                        closeOnCancel: false

                    }, function (isConfirm) {
                        if (isConfirm) {
                            $location.path("/locacao/novalocacao/imovel/" + response.data.id_imovel);
                            swal.close();
                        } else {
                            swal.close();
                        }
                    });
                } else {
                    SweetAlert.swal('', response.data.dados.msg, 'error');
                }
            });
            $scope.limparCampos();
        }
    };

    $scope.buscarLocacoes = function () {
        $http.get(url + '/controllers/locacao.php?acao=buscar'+
            '&id_cliente=' + $scope.formData.id_cliente)
        .then(function (response) {
            $scope.locacoes = response.data;
        });
    };

    $scope.pegaMensalidade = function(index){
        $scope.formData.nome_cliente          = $scope.locacoes[index].nome_cliente;
        $scope.formData.email_cliente         = $scope.locacoes[index].email_cliente;
        $scope.formData.telefone_cliente      = $scope.locacoes[index].telefone_cliente;

        $scope.formData.endereco              = $scope.locacoes[index].endereco;
        $scope.formData.nome_proprietario     = $scope.locacoes[index].nome_proprietario;
        $scope.formData.email_proprietario    = $scope.locacoes[index].email_proprietario;
        $scope.formData.telefone_proprietario = $scope.locacoes[index].telefone_proprietario;
        $scope.formData.dia_repasse           = $scope.locacoes[index].dia_repasse;

        $http.get(url + '/controllers/locacao.php?acao=buscarMensalidades'+
            '&id_locacao=' + $scope.locacoes[index].id_locacao)
            .then(function (response) {
                $scope.mensalidades = response.data;
                $scope.index = index;

                setTimeout(function(){
                    $scope.mensalidades.forEach(m => {
                        if (m.mensalidade_paga == '1') {
                            $('#mensalidade_check'+m.id_mensalidade).prop('checked', true);
                            $('#mensalidade_check'+m.id_mensalidade).prop('disabled', 'disabled');
                        }

                        if (m.repasse == '1'){
                            $('#repasse_check'+m.id_mensalidade).prop('checked', true);
                            $('#repasse_check'+m.id_mensalidade).prop('disabled', 'disabled');
                        }
                    });
                }, 100);
            }
        );
    }

    $scope.receberMensalidade = function(id_mensalidade){
        if ($('#mensalidade_check'+id_mensalidade).is(':checked')){
            SweetAlert.swal({
                title: "",
                text: "Deseja realmente marcar essa mensalidade como recebida?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "Ok",
                closeOnConfirm: false,
                closeOnCancel: false
    
            }, function (isConfirm) {
                if (isConfirm){
                    $http.get(url + '/controllers/locacao.php?acao=receberMensalidade'+
                        '&id_mensalidade=' + id_mensalidade)
                        .then(function (response) {
                            if (response.data){
                                $scope.pegaMensalidade($scope.index);
                            }
                        }
                    );
                } else {
                    $('#mensalidade_check'+id_mensalidade).prop('checked', false);
                }
                swal.close();
            });
        }
    }

    $scope.pagarRepasse = function(id_mensalidade){
        if ($('#repasse_check'+id_mensalidade).is(':checked')){
            SweetAlert.swal({
                title: "",
                text: "Deseja realmente marcar esse repasse como pago?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "Ok",
                closeOnConfirm: false,
                closeOnCancel: false
    
            }, function (isConfirm) {
                if (isConfirm){
                    $http.get(url + '/controllers/locacao.php?acao=pagarRepasse'+
                        '&id_mensalidade=' + id_mensalidade)
                        .then(function (response) {
                            if (response.data){
                                $scope.pegaMensalidade($scope.index);
                            }
                        }
                    );
                } else {
                    $('#repasse_check'+id_mensalidade).prop('checked', false);
                }
                swal.close();
            });
        }
    }

    $scope.calcularMensalidades = function (){
        if ($rootScope.valor_aluguel > 0){
            $http.get(url + '/controllers/cliente.php?acao=buscar&id_cliente='+$rootScope.id_cliente+'&string_busca=')
                .then(function (response) {
                    $scope.formData.nome_cliente     = response.data[0].nome;
                    $scope.formData.email_cliente    = response.data[0].email;
                    $scope.formData.telefone_cliente = response.data[0].telefone;
                }
            );

            $http.get(url + '/controllers/imovel.php?acao=buscar&id_imovel='+$rootScope.id_imovel+'&string_busca=')
                .then(function (response) {
                    $scope.formData.endereco              = response.data[0].endereco;
                    $scope.formData.nome_proprietario     = response.data[0].nome_proprietario;
                    $scope.formData.email_proprietario    = response.data[0].email_proprietario;
                    $scope.formData.telefone_proprietario = response.data[0].telefone_proprietario;
                    $scope.formData.dia_repasse           = response.data[0].dia_repasse;
                }
            );

            $http.get(url + '/controllers/locacao.php?acao=gerarMensalidades'+
                '&data_ini='           +$rootScope.data_ini+
                '&data_fim='           +$rootScope.data_fim+
                '&taxa_administracao=' +$rootScope.taxa_administracao+
                '&valor_aluguel='      +$rootScope.valor_aluguel+
                '&valor_condominio='   +$rootScope.valor_condominio+
                '&valor_iptu='         +$rootScope.valor_iptu)
                .then(function (response) {
                    $scope.mensalidades   = response.data.mensalidades;
                    $scope.total_contrato = response.data.total_contrato;
                }
            );
        }
    }
    $scope.calcularMensalidades();

    $scope.finalizaLocacao = function(){
        $http.get(url + '/controllers/locacao.php?acao=salvar'+
            '&id_cliente='         +$rootScope.id_cliente+
            '&id_imovel='          +$rootScope.id_imovel+
            '&data_ini='           +$rootScope.data_ini+
            '&data_fim='           +$rootScope.data_fim+
            '&taxa_administracao=' +$rootScope.taxa_administracao+
            '&valor_aluguel='      +$rootScope.valor_aluguel+
            '&valor_condominio='   +$rootScope.valor_condominio+
            '&valor_iptu='         +$rootScope.valor_iptu)
            .then(function (response) {
                if(response.data.status){
                    SweetAlert.swal({
                        title: "Locação salva com sucesso!",
                        text: "",
                        type: "success",
                        showCancelButton: false,
                        confirmButtonColor: "#1c84c6",
                        confirmButtonText: "Ok",
                        closeOnConfirm: false,
                        closeOnCancel: false
            
                    }, function () {
                        $rootScope.id_cliente         = '';
                        $rootScope.id_imovel          = '';
                        $rootScope.data_ini           = '';
                        $rootScope.data_fim           = '';
                        $rootScope.taxa_administracao = '';
                        $rootScope.valor_aluguel      = '';
                        $rootScope.valor_condominio   = '';
                        $rootScope.valor_iptu         = '';

                        $location.path("/locacao/novalocacao/cliente/");
                        swal.close();
                    });
                } else {
                    SweetAlert.swal({
                        title: 'Ops!',
                        text: response.data.msg,
                        type: "error",
                        showCancelButton: false,
                        confirmButtonColor: "#1c84c6",
                        confirmButtonText: "Ok",
                        closeOnConfirm: false,
                        closeOnCancel: false
            
                    });
                }
            }
        );
    }

    $scope.pegaCliente = function(){
        $rootScope.id_cliente = $scope.formData.id_cliente;
    }

    $scope.pegaImovel = function(){
        $rootScope.id_imovel = $scope.formData.id_imovel;
    }

    $scope.setCliente = function(){
        $scope.formData.id_cliente = $rootScope.id_cliente;
    }

    $scope.setImovel = function(){
        $scope.formData.id_imovel = $rootScope.id_imovel;
    }

    $scope.pegaValores = function(){
        $rootScope.data_ini           = $scope.formData.data_ini;
        $rootScope.data_fim           = $scope.formData.data_fim;
        $rootScope.taxa_administracao = $scope.formData.taxa_administracao;
        $rootScope.valor_aluguel      = $scope.formData.valor_aluguel;
        $rootScope.valor_condominio   = $scope.formData.valor_condominio;
        $rootScope.valor_iptu         = $scope.formData.valor_iptu;
    }

    $scope.setValores = function(){
        $scope.formData.data_ini           = $rootScope.data_ini;
        $scope.formData.data_fim           = $rootScope.data_fim;
        $scope.formData.taxa_administracao = $rootScope.taxa_administracao;
        $scope.formData.valor_aluguel      = $rootScope.valor_aluguel;
        $scope.formData.valor_condominio   = $rootScope.valor_condominio;
        $scope.formData.valor_iptu         = $rootScope.valor_iptu;
    }

    $scope.carregaClientesChosen = function(){
        $http.get(url + '/controllers/locacao.php?acao=getClientes')
            .then(function (response) {
                $scope.clientes = response.data;
                $scope.setCliente();
            }
        );
    }

    $scope.carregaImoveisChosen = function(){
        $http.get(url + '/controllers/locacao.php?acao=getImoveis')
            .then(function (response) {
                $scope.imoveis = response.data;
                $scope.setImovel();
            }
        );
    }

    $scope.carregaClientesChosen();
    $scope.carregaImoveisChosen();
    $scope.setValores();
}
angular
    .module('inspinia')
    .controller('LocacaoController', LocacaoController);
