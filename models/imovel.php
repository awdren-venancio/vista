<?php
    require_once('conexao.php');
    
    class ImovelModel extends Conexao {
        public $id_imovel;
        public $endereco;
        public $id_proprietario;
        public $string_busca;
        
        function inserir_alterar(){
            if ($this->id_imovel == 0){
                $sql = "insert into sys.imovel (
                            endereco,
                            id_proprietario)
                        values (
                            '$this->endereco',
                             $this->id_proprietario
                        );";
            } else {
                $sql = "update sys.imovel set 
                            endereco        = '$this->endereco',
                            id_proprietario =  $this->id_proprietario
                        where 
                            id_imovel = '$this->id_imovel';";
            }
            return mysqli_query($this->conect, $sql);
        }

        function getImovel(){
            if ($this->id_imovel > 0){
                $sql = "select 
                            i.*, 
                            p.nome as nome_proprietario,
                            p.email as email_proprietario,
                            p.telefone as telefone_proprietario,
                            p.dia_repasse
                        from sys.imovel i
                        inner join proprietario p 
                        on p.id_proprietario = i.id_proprietario
                        where 
                            id_imovel='$this->id_imovel';";

            } else {
                $sql = "select 
                            i.*, 
                            p.nome as nome_proprietario,
                            p.email as email_proprietario,
                            p.telefone as telefone_proprietario,
                            p.dia_repasse
                        from sys.imovel i
                        inner join proprietario p 
                        on p.id_proprietario = i.id_proprietario
                        where 
                            endereco like '%$this->string_busca%'
                        limit 50;";
            }
            $result = mysqli_query($this->conect, $sql);

            $ret = array();
            while($r = mysqli_fetch_array($result, MYSQLI_ASSOC)){
                array_push($ret, $r);
            }
            return $ret;
        }

        function sql($sql){
			mysqli_set_charset('utf8');
			return mysqli_query($this->conect, $sql);
        }
    }