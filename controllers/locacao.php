<?php
ini_set('display_errors',1);
ini_set('display_startup_erros',1);
error_reporting(E_ALL);

    require_once('../models/locacao.php');

    class LocacaoController {
    
        public function __construct($acao) {
            if ($acao == 'getImoveis')  $this->getImoveis();
            if ($acao == 'salvar')  $this->salvar();
        }

        public function getImoveis(){
            $locacaoModel = new LocacaoModel();

            $result = $locacaoModel->getImoveis();
            echo json_encode($result);
        }

        public function salvar(){
            $endereco        = $_GET['endereco'];
            $id_proprietario = $_GET['id_proprietario'];

            $locacaoModel = new LocacaoModel();

            $locacaoModel->endereco          = $endereco;
            $locacaoModel->id_proprietario   = $id_proprietario;
				
            $salvou = $locacaoModel->inserir_alterar();

            $ret = array(
                'status' => $salvou
            );
            echo json_encode($ret);
        }
    }

    new LocacaoController($_GET['acao']);