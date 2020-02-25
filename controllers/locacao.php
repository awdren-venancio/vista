<?php
ini_set('display_errors',1);
ini_set('display_startup_erros',1);
error_reporting(E_ALL);

    require_once('../models/locacao.php');

    class LocacaoController {
    
        public function __construct($acao) {
            if ($acao == 'getClientes')       $this->getClientes();
            if ($acao == 'getImoveis')        $this->getImoveis();
            if ($acao == 'salvar')            $this->salvar();
            if ($acao == 'gerarMensalidades') $this->gerarMensalidades();
        }

        public function getClientes(){
            $locacaoModel = new LocacaoModel();

            $result = $locacaoModel->getClientes();
            echo json_encode($result);
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

        public function gerarMensalidades(){
            $data_ini           = $_GET['data_ini'];
            $data_fim           = $_GET['data_fim'];
            $taxa_administracao = $_GET['taxa_administracao'];
            $valor_aluguel      = $_GET['valor_aluguel'];
            $valor_condominio   = $_GET['valor_condominio'];
            $valor_iptu         = $_GET['valor_iptu'];

            $data_aux = explode('/',$data_ini);
            $dia = $data_aux[0];
            $mes = $data_aux[1];
            $ano = $data_aux[2];

            $mensalidades = array();
            for ($i = 1; $i <= 12; $i++) {
                $total_mes = $taxa_administracao+$valor_aluguel+$valor_condominio+$valor_iptu;

                if ($i == 1) {
                    $vencimento = $data_ini;

                    if ($dia <> 1){
                        $dias_locados = 30 - $dia;

                        $taxa_administracao = $taxa_administracao * $dias_locados / 30;
                        $valor_aluguel      = $valor_aluguel * $dias_locados / 30;
                        $valor_condominio   = $valor_condominio * $dias_locados / 30;
                        $valor_iptu         = $valor_iptu * $dias_locados / 30;
                        $total_mes          = $total_mes * $dias_locados / 30;
                    }
                } else {

                    if ($i == 2){
                        $data_ini           = $_GET['data_ini'];
                        $data_fim           = $_GET['data_fim'];
                        $taxa_administracao = $_GET['taxa_administracao'];
                        $valor_aluguel      = $_GET['valor_aluguel'];
                        $valor_condominio   = $_GET['valor_condominio'];
                        $valor_iptu         = $_GET['valor_iptu'];
                    }

                    $mes++;
                    if ($mes == 13) {
                        $mes = '01';
                        $ano++;
                    }
                    $vencimento = '01/'.$mes.'/'.$ano;
                }

                $mensalidades[$i] = array(
                    'vencimento'         => $vencimento,
                    'taxa_administracao' => $taxa_administracao,
                    'valor_aluguel'      => $valor_aluguel,
                    'valor_condominio'   => $valor_condominio,
                    'valor_iptu'         => $valor_iptu,
                    'total_mes'          => $total_mes
                );
            }
            echo json_encode($mensalidades);
        }
    }

    new LocacaoController($_GET['acao']);