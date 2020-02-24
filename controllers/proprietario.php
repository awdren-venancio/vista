<?php
ini_set('display_errors',1);
ini_set('display_startup_erros',1);
error_reporting(E_ALL);

    require_once('../models/proprietario.php');

    class ProprietarioController {
    
        public function __construct($acao) {
            if ($acao == 'buscar')  $this->buscar();
            if ($acao == 'salvar')  $this->salvar();
        }

        public function buscar(){
            $proprietarioModel = new ProprietarioModel();

            $id_proprietario   = $_GET['id_proprietario'];
            $string_busca      = $_GET['string_busca'];

            $proprietarioModel->id_proprietario   = $id_proprietario;
            $proprietarioModel->string_busca      = $string_busca;

            $result = $proprietarioModel->getProprietario();
            echo json_encode($result);
        }

        public function salvar(){
            $id_proprietario = $_GET['id_proprietario'];
            $nome        = $_GET['nome'];
            $email       = $_GET['email'];
            $telefone    = $_GET['telefone'];
            $dia_repasse = $_GET['dia_repasse'];

            $proprietarioModel = new ProprietarioModel();

            $proprietarioModel->id_proprietario = $id_proprietario;
            $proprietarioModel->nome        = $nome;
            $proprietarioModel->email       = $email;
            $proprietarioModel->telefone    = $telefone;
            $proprietarioModel->dia_repasse = $dia_repasse;
				
            $salvou = $proprietarioModel->inserir_alterar();

            $ret = array(
                'status' => $salvou
            );
            echo json_encode($ret);
        }
    }

    new ProprietarioController($_GET['acao']);