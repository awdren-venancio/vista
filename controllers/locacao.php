<?php
ini_set('display_errors',1);
ini_set('display_startup_erros',1);
error_reporting(E_ALL);

    require_once('../models/locacao.php');

    class LocacaoController {
    
        public function __construct($acao) {
            if ($acao == 'getClientes')        $this->getClientes();
            if ($acao == 'getImoveis')         $this->getImoveis();
            if ($acao == 'salvar')             $this->salvar();
            if ($acao == 'gerarMensalidades')  $this->gerarMensalidades();
            if ($acao == 'buscar')             $this->buscar();
            if ($acao == 'buscarMensalidades') $this->buscarMensalidades();
            if ($acao == 'receberMensalidade') $this->receberMensalidade();
            if ($acao == 'pagarRepasse')       $this->pagarRepasse();
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

        public function converteDataMySql($data){
            $data = explode('/',$data);
            $ret = $data[2].'/'.$data[1].'/'.$data[0];
            return $ret;
        }

        public function salvar(){
            $locacaoModel = new LocacaoModel();
            
            $locacaoModel->id_cliente         = $_GET['id_cliente'];
            $locacaoModel->id_imovel          = $_GET['id_imovel'];
            $locacaoModel->data_ini           = $this->converteDataMySql($_GET['data_ini']);
            $locacaoModel->data_fim           = $this->converteDataMySql($_GET['data_fim']);
            $locacaoModel->taxa_administracao = $_GET['taxa_administracao'];
            $locacaoModel->valor_aluguel      = $_GET['valor_aluguel'];
            $locacaoModel->valor_condominio   = $_GET['valor_condominio'];
            $locacaoModel->valor_iptu         = $_GET['valor_iptu'];
            
            $retorno = $locacaoModel->inserir_locacao();
            $id_locacao = $retorno[0]['id_locacao'];

            if ($id_locacao > 0){
                $mensalidades = $this->gerarMensalidades();

                $salvou = true;

                foreach ($mensalidades['mensalidades'] as $mes){
                    if ($salvou){
                        $locacaoModel->id_locacao         = $id_locacao;
                        $locacaoModel->vencimento         = $this->converteDataMySql($mes['vencimento']);
                        $locacaoModel->taxa_administracao = $mes['taxa_administracao'];
                        $locacaoModel->valor_aluguel      = $mes['valor_aluguel'];
                        $locacaoModel->valor_condominio   = $mes['valor_condominio'];
                        $locacaoModel->valor_iptu         = $mes['valor_iptu'];

                        $salvou = $locacaoModel->inserir_mensalidade();
                        
                        if (!$salvou) {
                            $ret = array(
                                'status' => false,
                                'msg' => 'Erro ao salvar mensalidade'
                            );
                        }
                    }
                }

                if ($salvou){
                    $ret = array(
                        'status' => true,
                        'msg' => 'Locação e Mensalidades salvas com sucesso'
                    );
                }
            } else {
                $ret = array(
                    'status' => false,
                    'msg' => 'Erro ao salvar Locacao'
                );
            }
            
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
            $total_contrato = 0;

            for ($i = 1; $i <= 12; $i++) {
                $total_mes = $valor_aluguel+$valor_condominio+$valor_iptu;

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
                    $mes++;
                    if ($mes == 13) {
                        $mes = '1';
                        $ano++;
                    }
                    if ($mes <= 9) $mes = '0'.$mes;
                    $vencimento = '01/'.$mes.'/'.$ano;
                }

                $total_contrato = $total_contrato+$total_mes;

                $mensalidades['mensalidades'][$i] = array(
                    'vencimento'         => $vencimento,
                    'taxa_administracao' => $taxa_administracao,
                    'valor_aluguel'      => $valor_aluguel,
                    'valor_condominio'   => $valor_condominio,
                    'valor_iptu'         => $valor_iptu,
                    'total_mes'          => $total_mes
                );

                if ($i == 1){
                    $data_ini           = $_GET['data_ini'];
                    $data_fim           = $_GET['data_fim'];
                    $taxa_administracao = $_GET['taxa_administracao'];
                    $valor_aluguel      = $_GET['valor_aluguel'];
                    $valor_condominio   = $_GET['valor_condominio'];
                    $valor_iptu         = $_GET['valor_iptu'];
                }
            }

            $mensalidades['total_contrato'] = $total_contrato;
            if ($_GET['acao'] == 'salvar') {
                return $mensalidades;
            } else {
                echo json_encode($mensalidades);
            }
        }

        public function buscar(){
            $locacaoModel = new LocacaoModel();

            $id_cliente    = $_GET['id_cliente'];
            if ($id_cliente == 'undefined') $id_cliente = 0;

            $locacaoModel->id_cliente = $id_cliente;

            $result = $locacaoModel->getLocacoes();
            echo json_encode($result);
        }

        public function buscarMensalidades(){
            $locacaoModel = new LocacaoModel();

            $id_locacao = $_GET['id_locacao'];
            $locacaoModel->id_locacao = $id_locacao;

            $result = $locacaoModel->getMensalidades();
            echo json_encode($result);
        }

        public function receberMensalidade(){
            $locacaoModel = new LocacaoModel();

            $id_mensalidade = $_GET['id_mensalidade'];
            $locacaoModel->id_mensalidade = $id_mensalidade;
            
            $result = $locacaoModel->receberMensalidade();
            echo json_encode($result);
        }

        public function pagarRepasse(){
            $locacaoModel = new LocacaoModel();

            $id_mensalidade = $_GET['id_mensalidade'];
            $locacaoModel->id_mensalidade = $id_mensalidade;
            
            $result = $locacaoModel->pagarRepasse();
            echo json_encode($result);
        }
    }

    new LocacaoController($_GET['acao']);