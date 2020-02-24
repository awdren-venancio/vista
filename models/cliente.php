<?php
    require_once('conexao.php');
    
    class ClienteModel extends Conexao {
        public $id_cliente;
        public $nome;
        public $email;
        public $telefone;
        public $string_busca;
        
        function inserir_alterar(){
            if ($this->id_cliente == 0){
                $sql = "insert into sys.cliente (
                            nome,
                            email,
                            telefone)
                        values (
                            '$this->nome',
                            '$this->email',
                            '$this->telefone'
                        );";
            } else {
                $sql = "update sys.cliente set 
                            nome     = '$this->nome',
                            email    = '$this->email',
                            telefone = '$this->telefone'
                        where 
                            id_cliente = '$this->id_cliente';";
            }
            return mysqli_query($this->conect, $sql);
        }

        function getCliente(){
            if ($this->id_cliente > 0){
                $sql = "select * from sys.cliente where id_cliente='$this->id_cliente';";
            } else {
                $sql = "select * from sys.cliente 
                        where 
                            nome like '%$this->string_busca%' or 
                            email like '%$this->string_busca%' or 
                            telefone like '%$this->string_busca%' 
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