<?php
    require_once('conexao.php');
    
    class LocacaoModel extends Conexao {
        public $id_cliente;
        public $id_imovel;
        public $data_ini;
        public $data_fim;
        public $taxa_administracao;
        public $valor_aluguel;
        public $valor_condominio;
        public $valor_iptu;
        
        public $id_mensalidade;
        public $id_locacao;
        public $vencimento;
        
        function inserir_locacao(){
            $sql = "insert into sys.locacao (
                        id_cliente,
                        id_imovel,
                        data_ini,
                        data_fim,
                        taxa_administracao,
                        valor_aluguel,
                        valor_condominio,
                        valor_iptu
                    ) values (
                        $this->id_cliente,
                        $this->id_imovel,
                        '$this->data_ini',
                        '$this->data_fim',
                        $this->taxa_administracao,
                        $this->valor_aluguel,
                        $this->valor_condominio,
                        $this->valor_iptu
                    );";
            
            mysqli_query($this->conect, $sql);
            
            $result = mysqli_query($this->conect, 'select LAST_INSERT_ID() as id_locacao;');

            $ret = array();
            while($r = mysqli_fetch_array($result, MYSQLI_ASSOC)){
                array_push($ret, $r);
            }
            return $ret;
        }

        function inserir_mensalidade(){
            $sql = "insert into sys.mensalidade (
                        id_locacao,
                        vencimento,
                        mensalidade_paga,
                        repasse,
                        taxa_administracao,
                        valor_aluguel,
                        valor_condominio,
                        valor_iptu
                    ) values (
                        $this->id_locacao,
                        '$this->vencimento',
                        false,
                        false,
                        $this->taxa_administracao,
                        $this->valor_aluguel,
                        $this->valor_condominio,
                        $this->valor_iptu
            );";

            return mysqli_query($this->conect, $sql);
        }

        function getClientes(){
            $sql = "select * from sys.cliente;";
            $result = mysqli_query($this->conect, $sql);

            $ret = array();
            while($r = mysqli_fetch_array($result, MYSQLI_ASSOC)){
                array_push($ret, $r);
            }
            return $ret;
        }

        function getImoveis(){
            $sql = "select
                        i.*,
                        p.nome as nome_proprietario,
                        p.telefone as telefone_proprietario,
                        p.dia_repasse
                    from sys.imovel i
                    inner join proprietario p 
                    on p.id_proprietario = i.id_proprietario;";
            $result = mysqli_query($this->conect, $sql);

            $ret = array();
            while($r = mysqli_fetch_array($result, MYSQLI_ASSOC)){
                array_push($ret, $r);
            }
            return $ret;
        }

        function getLocacoes(){
            $sql = "select 
                        (select sum(valor_aluguel+valor_iptu+valor_condominio) from sys.mensalidade m where m.id_locacao = l.id_locacao and m.mensalidade_paga = false)  as saldo_receber,
                        (select sum(valor_aluguel+valor_iptu-taxa_administracao) from sys.mensalidade m where m.id_locacao = l.id_locacao and m.repasse = false)  as saldo_repassar,
                        (select sum(valor_aluguel+valor_iptu+valor_condominio) from sys.mensalidade m where m.id_locacao = l.id_locacao and m.repasse = false)  as valor_contrato,
                        l.*,
                        c.nome as nome_cliente,
                        c.email as email_cliente,
                        c.telefone as telefone_cliente,
                        i.endereco,
                        p.nome as nome_proprietario,
                        p.email as email_proprietario,
                        p.telefone as telefone_proprietario,
                        p.dia_repasse
                    from sys.locacao l 
                    inner join sys.cliente c on c.id_cliente = l.id_cliente
                    inner join sys.imovel i  on i.id_imovel  = l.id_imovel
                    inner join sys.proprietario p on p.id_proprietario = i.id_proprietario
                    where l.id_cliente = $this->id_cliente or $this->id_cliente <= 0;";

            $result = mysqli_query($this->conect, $sql);

            $ret = array();
            while($r = mysqli_fetch_array($result, MYSQLI_ASSOC)){
                array_push($ret, $r);
            }
            return $ret; 
        }

        function getMensalidades(){
            $sql = "select *,
                        date_format(vencimento,'%d/%m/%Y') as vencimento,
                        case mensalidade_paga when false
                            then (valor_aluguel+valor_iptu+valor_condominio)
                            else 0 
                        end as valor_receber,
                        case repasse when false
                            then (valor_aluguel+valor_iptu-taxa_administracao)
                            else 0 
                        end as valor_repassar
                    from sys.mensalidade
                    where id_locacao=$this->id_locacao;";
            
            $result = mysqli_query($this->conect, $sql);

            $ret = array();
            while($r = mysqli_fetch_array($result, MYSQLI_ASSOC)){
                array_push($ret, $r);
            }
            return $ret;
        }

        function receberMensalidade(){
            $sql = "update sys.mensalidade set 
                            mensalidade_paga = true
                        where 
                            id_mensalidade = '$this->id_mensalidade';";
            
            $ret = mysqli_query($this->conect, $sql);

            return $ret;
        }

        function pagarRepasse(){
            $sql = "update sys.mensalidade set 
                            repasse = true
                        where 
                            id_mensalidade = '$this->id_mensalidade';";
            
            $ret = mysqli_query($this->conect, $sql);

            return $ret;
        }

        function sql($sql){
			mysqli_set_charset('utf8');
			return mysqli_query($this->conect, $sql);
        }
    }