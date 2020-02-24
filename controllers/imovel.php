<?php
ini_set('display_errors',1);
ini_set('display_startup_erros',1);
error_reporting(E_ALL);

    require_once('../models/imovel.php');

    class ImovelController {
    
        public function __construct($acao) {
            if ($acao == 'buscar')  $this->buscar();
            if ($acao == 'salvar')  $this->salvar();
        }

        public function buscar(){
            $imovelModel = new ImovelModel();

            $id_imovel    = $_GET['id_imovel'];
            $string_busca = $_GET['string_busca'];

            $imovelModel->id_imovel    = $id_imovel;
            $imovelModel->string_busca = $string_busca;

            $result = $imovelModel->getImovel();
            echo json_encode($result);
        }

        public function salvar(){
            $id_imovel       = $_GET['id_imovel'];
            $endereco        = $_GET['endereco'];
            $id_proprietario = $_GET['id_proprietario'];

            $imovelModel = new ImovelModel();

            $imovelModel->id_imovel         = $id_imovel;
            $imovelModel->endereco          = $endereco;
            $imovelModel->id_proprietario   = $id_proprietario;
				
            $salvou = $imovelModel->inserir_alterar();

            $ret = array(
                'status' => $salvou
            );
            echo json_encode($ret);
        }
    }

    new ImovelController($_GET['acao']);