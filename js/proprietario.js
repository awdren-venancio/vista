function ProprietarioController($scope, $http, $state, $location, SweetAlert, notify) {

    var url = 'http://' + location.host;

    $scope.formData = {
        id_proprietario: '',
        nome: '',
        email: '',
        telefone: '',
        dia_repasse: ''
    }

    $scope.formData.error = {
        nome: false,
        email: false
    }

    $scope.input_busca = '';

    $scope.limparCampos = function () {
        $scope.formData.id_proprietario = '';
        $scope.formData.nome = '';
        $scope.formData.email = '';
        $scope.formData.telefone = '';
        $scope.formData.dia_repasse = '';
    }

    $scope.salvarProprietario = function () {
        $scope.formData.error.nome        = false;
        $scope.formData.error.dia_repasse = false;
        
        if ($scope.formData.nome.length <= 2) {
            $scope.formData.error.nome = true;
        }

        if ($scope.formData.dia_repasse == '') {
            $scope.formData.error.dia_repasse = true;
        }

        if ($scope.formData.error.nome || $scope.formData.error.dia_repasse) {
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
            $http.get(url + '/controllers/proprietario.php?acao=salvar&'+
                '&id_proprietario=' + $scope.formData.id_proprietario+
                '&nome='        + $scope.formData.nome+
                '&email='       + $scope.formData.email+
                '&telefone='    + $scope.formData.telefone+
                '&dia_repasse=' + $scope.formData.dia_repasse
            ).then(function (response) {
                console.log('resposta do php:')
                console.log(response);

                if (response.status) {

                    SweetAlert.swal({
                        title: "Proprietário salvo com sucesso!",
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
                            $location.path("/locacao/novalocacao/proprietario/" + response.data.id_proprietario);
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

    $scope.buscarProprietario = function (id_proprietario) {
        if (id_proprietario > 0 || $scope.input_busca.length >= 1) {
            $http.get(url + '/controllers/proprietario.php?acao=buscar&'+
            '&id_proprietario='   + id_proprietario+
            '&string_busca=' + $scope.input_busca)
            .then(function (response) {
                $scope.proprietarios = response.data;

                if (id_proprietario > 0 && response.data.length > 0){
                    $scope.formData.nome        = response.data[0].nome;
                    $scope.formData.email       = response.data[0].email;
                    $scope.formData.telefone    = response.data[0].telefone;
                    $scope.formData.dia_repasse = response.data[0].dia_repasse;
                } else if (id_proprietario > 0 && response.data.length == 0){
                    SweetAlert.swal({
                        title: "Ops..!",
                        text: 'Proprietário com ID: '+id_proprietario+' não encontrado!',
                        type: "error"
                    })
                }
            });
        }
    };
    
    this.editarCadastro = function (componente) {
        location.href = url + "/#/proprietario/cadastroproprietario/" + componente.x.id_proprietario;
    };

    this.iniciarLocacao = function (componente) {
        location.href = url + "/#/locacao/novalocacao/proprietario/" + componente.x.id_proprietario;
    };

    $scope.pegaIdProprietarioDaUrl = function () {
        $scope.formData.id_proprietario = $state.params.id_proprietario;
        if ($scope.formData.id_proprietario != '') {
            $scope.buscarProprietario($scope.formData.id_proprietario);
        }
    };
    $scope.pegaIdProprietarioDaUrl();

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
    .controller('ProprietarioController', ProprietarioController);
