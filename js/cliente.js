function ClienteController($scope, $http, $state, $location, SweetAlert, notify) {

    var url = 'http://' + location.host;

    $scope.formData = {
        id_cliente: '',
        nome: '',
        email: '',
        telefone: ''
    }

    $scope.formData.error = {
        nome: false,
        email: false
    }

    $scope.input_busca = '';

    $scope.limparCampos = function () {
        $scope.formData.id_cliente = '';
        $scope.formData.nome = '';
        $scope.formData.email = '';
        $scope.formData.telefone = '';
    }

    $scope.salvarCliente = function () {
        $scope.formData.error.nome = false;
        
        if ($scope.formData.nome.length <= 2) {
            $scope.formData.error.nome = true;
        }
        if ($scope.formData.error.nome) {
            SweetAlert.swal({
                title: "Ops..!",
                text: 'Campo em destaque obrigatório!',
                type: "error"
            });
        } else if ($scope.formData.error.email){
            SweetAlert.swal({
                title: "Ops..!",
                text: 'E-mail inválido!',
                type: "error"
            });
        } else {
            $http.get(url + '/controllers/cliente.php?acao=salvar&'+
                '&id_cliente=' + $scope.formData.id_cliente+
                '&nome='       + $scope.formData.nome+
                '&email='      + $scope.formData.email+
                '&telefone='   + $scope.formData.telefone
            ).then(function (response) {
                
                if (response.status) {

                    SweetAlert.swal({
                        title: "Cliente salvo com sucesso!",
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
                            $location.path("/locacao/novalocacao/cliente/" + response.data.id_cliente);
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

    $scope.buscarCliente = function (id_cliente) {
        if (id_cliente > 0 || $scope.input_busca.length >= 1) {
            $http.get(url + '/controllers/cliente.php?acao=buscar&'+
            '&id_cliente='   + id_cliente+
            '&string_busca=' + $scope.input_busca)
            .then(function (response) {

                $scope.clientes = response.data;

                if (id_cliente > 0 && response.data.length > 0){
                    $scope.formData.nome     = response.data[0].nome;
                    $scope.formData.email    = response.data[0].email;
                    $scope.formData.telefone = response.data[0].telefone;
                } else if (id_cliente > 0 && response.data.length == 0){
                    SweetAlert.swal({
                        title: "Ops..!",
                        text: 'Cliente com ID: '+id_cliente+' não encontrado!',
                        type: "error"
                    })
                }
            });
        }
    };

    this.editarCadastro = function (componente) {
        location.href = url + "/#/cliente/cadastrocliente/" + componente.x.id_cliente;
    };

    this.iniciarLocacao = function (componente) {
        location.href = url + "/#/locacao/novalocacao/cliente/" + componente.x.id_cliente;
    };

    $scope.pegaIdClienteDaUrl = function () {
        $scope.formData.id_cliente = $state.params.id_cliente;
        if ($scope.formData.id_cliente != '') {
            $scope.buscarCliente($scope.formData.id_cliente);
        }
    };
    $scope.pegaIdClienteDaUrl();

    $scope.validarEmail = function () {
        var usuario = $scope.formData.email.substring(0, $scope.formData.email.indexOf("@"));
        var dominio = $scope.formData.email.substring($scope.formData.email.indexOf("@") + 1, $scope.formData.email.length);
        var email_ok = true;
        
        if (usuario.length < 1)                            email_ok = false;
        if (dominio.length < 3)                            email_ok = false;
        if (usuario.search("@") != -1)                     email_ok = false;
        if (dominio.search("@") != -1)                     email_ok = false;
        if (usuario.search(" ") != -1)                     email_ok = false;
        if (dominio.search(" ") != -1)                     email_ok = false;
        if (dominio.search(".") == -1)                     email_ok = false;
        if (dominio.indexOf(".") < 1)                      email_ok = false;
        if (dominio.lastIndexOf(".") > dominio.length - 1) email_ok = false;

        $scope.formData.error.email = (!email_ok);
    }
}
angular
    .module('inspinia')
    .controller('ClienteController', ClienteController);
