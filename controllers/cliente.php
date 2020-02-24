<?php
ini_set('display_errors',1);
ini_set('display_startup_erros',1);
error_reporting(E_ALL);

    require_once('../models/cliente.php');

    class ClienteController {
    
        public function __construct($acao) {
            if ($acao == 'buscar')  $this->buscar();
            if ($acao == 'salvar')  $this->salvar();
        }

        public function buscar(){
            $clienteModel = new ClienteModel();

            $id_cliente   = $_GET['id_cliente'];
            $string_busca = $_GET['string_busca'];

            $clienteModel->id_cliente   = $id_cliente;
            $clienteModel->string_busca = $string_busca;

            $result = $clienteModel->getCliente();
            echo json_encode($result);
        }

        public function salvar(){
            $id_cliente = $_GET['id_cliente'];
            $nome       = $_GET['nome'];
            $email      = $_GET['email'];
            $telefone   = $_GET['telefone'];

            $clienteModel = new ClienteModel();

            $clienteModel->id_cliente = $id_cliente;
            $clienteModel->nome       = $nome;
            $clienteModel->email      = $email;
            $clienteModel->telefone   = $telefone;
				
            $salvou = $clienteModel->inserir_alterar();

            $ret = array(
                'status' => $salvou
            );
            echo json_encode($ret);
        }
    }

    new ClienteController($_GET['acao']);